import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
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
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
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

apiClient.interceptors.response.use(
  (response) => {
    // 성공적인 응답은 그대로 반환
    return response;
  },
  async (error: AxiosError<ApiResponse<string | null>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 응답 데이터와 에러 상태 확인
    const errorResponseData = error.response?.data;

    if (
      error.response?.status === 401 &&
      errorResponseData?.data === 'REFRESH' && // 백엔드가 data 필드에 "REFRESH"를 준다고 가정
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, logout, setAccessToken } = useAuthStore.getState();

      if (!refreshToken) {
        console.log('리프레시 토큰 없음, 로그아웃 처리');
        logout();
        isRefreshing = false;
        processQueue(new Error('No refresh token'), null);
        // 로그인 페이지로 리다이렉션은 UI 레벨에서 처리 (예: 전역 상태 구독)
        return Promise.reject(error); // 또는 특정 에러 객체 반환
      }

      try {
        const refreshResponse = await postRefreshToken();

        if (refreshResponse.success && refreshResponse.data) {
          const newAccessToken = refreshResponse.data;
          setAccessToken(newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          }
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          console.error('토큰 재발급 실패 (응답 실패 또는 데이터 없음):', refreshResponse.error);
          logout();
          processQueue(new Error(refreshResponse.error?.message || 'Token refresh failed'), null);
          // 로그인 페이지로 리다이렉션
          return Promise.reject(error); // 또는 특정 에러 객체 반환
        }
      } catch (refreshError) {
        console.error('토큰 재발급 API 호출 중 에러:', refreshError);
        logout();
        processQueue(refreshError as Error, null);
        // 로그인 페이지로 리다이렉션
        return Promise.reject(error); // 또는 특정 에러 객체 반환
      } finally {
        isRefreshing = false;
      }
    }
    // 다른 모든 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default apiClient;
