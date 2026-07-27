import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false, // 초기에는 로그인 안 된 상태

      // 로그인 시 상태만 업데이트 (토큰은 httpOnly 쿠키로 서버가 관리)
      login: () => {
        set({ isLoggedIn: true });
        console.log('Zustand 스토어: 로그인 상태 저장됨 (persisted)');
      },

      // 로그아웃 시 상태 초기화
      logout: () => {
        set({ isLoggedIn: false });
        console.log('Zustand 스토어에서 로그아웃 처리됨 (persisted)');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
