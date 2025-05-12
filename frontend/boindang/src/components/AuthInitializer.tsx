"use client";

// =====================================================================================
// !!!! 중요 !!!! 개발용 인증 우회 로직 포함 !!!!
// 백엔드 로그인이 정상화되면 .env.local 파일에서 NEXT_PUBLIC_BYPASS_AUTH_REDIRECT 관련 설정을
// 반드시 제거하거나 false로 변경하고, 이 주석과 아래 관련 로직을 삭제해주세요.
// =====================================================================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import SplashScreen from './SplashScreen';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const showSplashThenCheckAuth = async () => {
      console.log('AuthInitializer: Showing splash screen and starting 1-second delay...');
      // 1초 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('AuthInitializer: 1-second delay finished. Checking auth state...', { isLoggedIn });

      if (isLoggedIn) {
        console.log('AuthInitializer: User is logged in. Hiding splash screen.');
        setIsLoading(false); // 로그인 상태면 로딩 해제
      } else {
        // !!!! 중요 !!!! 아래는 개발용 인증 우회 로직입니다.
        // 백엔드 로그인이 정상화되면 .env.local 설정 변경 후 이 부분을 반드시 원래대로 되돌리거나 삭제하세요.
        const bypassRedirect = process.env.NEXT_PUBLIC_BYPASS_AUTH_REDIRECT === 'true';

        if (bypassRedirect) {
          console.warn('AuthInitializer: BYPASSING auth redirect for development. User is not logged in but allowing access.');
          setIsLoading(false); // 리다이렉션 안 하므로 로딩 해제
        } else {
          console.log('AuthInitializer: User is not logged in. Redirecting to /onboarding');
          router.replace('/onboarding');
          // 리다이렉션 후 로딩 상태 해제 (이전 수정 유지)
          setIsLoading(false);
        }
      }
    };

    showSplashThenCheckAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, router]); // isLoggedIn 또는 router 객체가 변경될 때만 실행

  if (isLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
} 