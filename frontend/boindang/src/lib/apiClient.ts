import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://k12d206.p.ssafy.io/api';
const API_BASE_URL = 'https://k12d206.p.ssafy.io/api';

const apiClient = axios.create({
  baseURL : API_BASE_URL,
  headers : {
    'Content-Type' : 'application/json',
  },
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 accessToken 가져오기
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
