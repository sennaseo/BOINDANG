import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { postRefreshToken } from '@/api/auth';
import type { ApiResponse } from '@/types/api';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://k12d206.p.ssafy.io/api';
const API_BASE_URL = 'https://k12d206.p.ssafy.io/api';

const apiClient = axios.create({
  baseURL : API_BASE_URL,
  headers : {
    'Content-Type' : 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    const isRefreshRequest = config.url === '/user/refresh'; // 실제 토큰 재발급 API 경로로 수정해야 할 수 있음

    console.log(`[APIClient Request Interceptor] Url: ${config.url}, IsRefresh: ${isRefreshRequest}, Token from store: ${accessToken ? 'Exists' : 'NULL'}`);

    if (accessToken && !isRefreshRequest) { // 재발급 요청이 아닐 때만 액세스 토큰 첨부
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('[APIClient Request Interceptor] Authorization header SET for:', config.url);
    } else if (isRefreshRequest) {
      console.log('[APIClient Request Interceptor] This is a refresh token request. Authorization header SKIPPED for:', config.url);
    } else {
      console.log('[APIClient Request Interceptor] No access token or is refresh request, Authorization header NOT set for:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 재발급 및 요청 재시도 관련 변수
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 토큰 재발급 및 원래 요청 재시도 핸들러 (공통 함수)
const handleTokenRefreshAndRetry = async (originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }) => {
  // 재시도 요청에 대해 다시 재발급 로직을 타지 않도록 체크
  if (originalRequest._retry) {
    console.log('[handleTokenRefreshAndRetry] Request already retried. Rejecting.');
    // 여기서 적절한 에러를 반환하거나, 특정 에러 객체를 reject 해야 합니다.
    // 예를 들어, 원래 에러를 그대로 reject 하거나, 새로운 커스텀 에러를 생성합니다.
    // 지금은 간단히 로그인 필요 에러 메시지로 reject 합니다.
    return Promise.reject(new Error("토큰 재발급 후에도 인증 실패. 다시 로그인해주세요."));
  }

  if (isRefreshing) {
    console.log('[handleTokenRefreshAndRetry] Token is already refreshing. Adding to queue.');
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(token => {
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
        }
        originalRequest._retry = true; // 재시도 플래그 설정
        return apiClient(originalRequest);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  originalRequest._retry = true; // 재시도 플래그 설정
  isRefreshing = true;
  console.log('[handleTokenRefreshAndRetry] Attempting token refresh for request to:', originalRequest.url);

  const { refreshToken, logout, setAccessToken } = useAuthStore.getState();

  if (!refreshToken) {
    console.error('[handleTokenRefreshAndRetry] No refresh token available. Logging out.');
    logout(); // Zustand 스토어의 로그아웃 액션
    isRefreshing = false;
    processQueue(new Error('No refresh token available. Please login again.'), null);
    return Promise.reject(new Error('No refresh token available. Please login again.'));
  }

  try {
    console.log('[handleTokenRefreshAndRetry] Calling postRefreshToken API.');
    const refreshResponse = await postRefreshToken(); // ApiResponse<string> 반환 가정

    if (refreshResponse.success && refreshResponse.data) {
      const newAccessToken = refreshResponse.data;
      console.log('[handleTokenRefreshAndRetry] Token refreshed successfully. New AT obtained.');
      setAccessToken(newAccessToken); // Zustand 스토어에 새 토큰 저장
      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      }
      processQueue(null, newAccessToken);
      console.log('[handleTokenRefreshAndRetry] Retrying original request with new token to:', originalRequest.url);
      return apiClient(originalRequest); // 원래 요청 재시도
    } else {
      console.error('[handleTokenRefreshAndRetry] Token refresh API call failed:', refreshResponse.error);
      logout();
      processQueue(new Error(refreshResponse.error?.message || 'Token refresh failed and no new token obtained.'), null);
      return Promise.reject(new Error(refreshResponse.error?.message || 'Token refresh failed.'));
    }
  } catch (refreshError) {
    console.error('[handleTokenRefreshAndRetry] Exception during postRefreshToken API call:', refreshError);
    logout();
    processQueue(refreshError as Error, null);
    return Promise.reject(refreshError); // 또는 더 구체적인 에러
  } finally {
    isRefreshing = false;
    console.log('[handleTokenRefreshAndRetry] Finished token refresh process. isRefreshing set to false.');
  }
};

// 응답 인터셉터
apiClient.interceptors.response.use(
  // 1. 성공 응답 처리 (HTTP 2xx)
  async (response: AxiosResponse<ApiResponse<unknown>>) => {
    const apiResponseData = response.data; // ApiResponse<T> 형태의 객체

    // HTTP 200 이지만, 백엔드가 success:false 이고 UNATHORIZED 에러를 준 경우
    if (apiResponseData && apiResponseData.success === false && apiResponseData.error?.status === 'UNAUTHORIZED') {
      console.warn('[APIClient Success Interceptor] Detected UNAUTHORIZED (token expired) in 2xx response for:', response.config.url);
      // 토큰 재발급 및 원래 요청 재시도
      return handleTokenRefreshAndRetry(response.config as InternalAxiosRequestConfig & { _retry?: boolean });
    }
    // 그 외 모든 정상적인 성공 응답 (실제 데이터가 있거나, success:true인 다른 로직 에러 포함)
    return response; // AxiosResponse를 그대로 반환해야 다음 then에서 response.data 등으로 접근
  },
  // 2. 에러 응답 처리 (HTTP 4xx, 5xx 등 네트워크 에러 포함)
  async (error: AxiosError<ApiResponse<unknown> | unknown >) => { // 에러 응답 타입은 다양할 수 있음
    console.error('[APIClient Error Interceptor] Error for URL:', error.config?.url, 'Status:', error.response?.status, 'Data:', error.response?.data);
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 실제 HTTP 401 에러인 경우
    if (error.response?.status === 401) {
      console.warn('[APIClient Error Interceptor] HTTP 401 Unauthorized error detected for:', originalRequest.url);
      // 토큰 재발급 및 원래 요청 재시도
      return handleTokenRefreshAndRetry(originalRequest);
    }
    
    // 다른 모든 에러는 그대로 reject
    return Promise.reject(error);
  }
);

export default apiClient;
