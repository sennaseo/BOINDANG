import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string | null) => void; // AccessToken 갱신 등에 필요할 수 있음
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false, // 초기에는 로그인 안 된 상태

      // 로그인 시 토큰과 상태 업데이트
      login: (accessToken, refreshToken) => {
        // 실제 앱에서는 토큰 유효성 검증 등을 추가할 수 있습니다.
        set({
          accessToken,
          refreshToken,
          isLoggedIn: true,
        });
        console.log('Zustand 스토어에 토큰 저장됨 (persisted)');
      },

      // 로그아웃 시 토큰과 상태 초기화
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
        });
        // 필요하다면 로컬 스토리지 등 다른 곳에 저장된 정보도 삭제
        // localStorage.removeItem('someOtherData');
        console.log('Zustand 스토어에서 로그아웃 처리됨 (persisted)');
      },

      // AccessToken만 업데이트하는 경우 (예: 토큰 갱신 성공 시)
      setAccessToken: (token) => {
        set({ accessToken: token });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
