import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Zustand 스토어 import

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
    // 컴포넌트 외부에서 스토어 상태를 직접 사용하려면 getState()를 사용합니다.
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      // AxiosHeaders 객체를 사용하여 헤더를 설정합니다.
      // 이전 버전의 axios에서는 config.headers.Authorization = ... 로 직접 할당했지만,
      // 최신 버전에서는 config.headers.set() 또는 타입 단언을 사용할 수 있습니다.
      // 여기서는 직접 할당이 여전히 많은 경우에 작동하므로 간결하게 사용합니다.
      // 문제가 발생하면 config.headers.set('Authorization', `Bearer ${accessToken}`); 형태로 변경 고려
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
