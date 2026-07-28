"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import SplashScreen from './SplashScreen';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const splashShownSessionKey = 'splashAlreadyShown';

// 비로그인 상태로도 접근 가능한 경로 (리다이렉트 대상에서 제외)
const PUBLIC_PATHS = ['/onboarding', '/login', '/signup'];

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  const [isHydrated, setIsHydrated] = useState(false);
  const [hasSplashBeenShown, setHasSplashBeenShown] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
      console.log('AuthInitializer: Zustand store rehydration finished.');
      setIsHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      console.log('AuthInitializer: Store rehydrated synchronously.');
      setIsHydrated(true);
      unsubFinishHydration();
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(splashShownSessionKey)) {
      console.log('AuthInitializer: Splash already shown in this session.');
      setHasSplashBeenShown(true);
    } else {
      console.log('AuthInitializer: First load in this session, will show splash delay.');
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      console.log('AuthInitializer: Waiting for store hydration...');
      return;
    }

    console.log('AuthInitializer: Store is hydrated.', { hasSplashBeenShown });

    const performAuthCheckAndFinishLoading = () => {
      console.log('AuthInitializer: Performing auth check...', { isLoggedIn });
      if (!isLoggedIn && !isPublicPath) {
        console.log('AuthInitializer: User is not logged in. Redirecting to /onboarding.');
        router.replace('/onboarding');
        // isLoading 은 그대로 둔다 — 아래 렌더 가드가 온보딩 도착 전까지 스플래시를 유지
        // (여기서 바로 풀면 보호 페이지가 한 프레임 그려지는 "번쩍" 현상이 남)
      }
      setIsLoading(false);
    };

    if (hasSplashBeenShown) {
      console.log('AuthInitializer: Skipping splash delay as it was already shown.');
      performAuthCheckAndFinishLoading();
    } else {
      console.log('AuthInitializer: Starting 1-second splash delay for first load...');
      const splashTimer = setTimeout(() => {
        console.log('AuthInitializer: Splash delay finished.');
        performAuthCheckAndFinishLoading();

        console.log('AuthInitializer: Marking splash as shown for this session.');
        try {
          sessionStorage.setItem(splashShownSessionKey, 'true');
          setHasSplashBeenShown(true);
        } catch (error) {
          console.error('AuthInitializer: Failed to set sessionStorage item:', error);
        }
      }, 1000);

      return () => {
        clearTimeout(splashTimer);
      };
    }
  }, [isLoggedIn, isHydrated, router, hasSplashBeenShown, isPublicPath]);

  // 로딩 중이거나, 비로그인 사용자가 보호 경로에 있는 동안(온보딩 리다이렉트 진행 중)은 스플래시 유지
  if (isLoading || (isHydrated && !isLoggedIn && !isPublicPath)) {
    console.log('AuthInitializer: showing SplashScreen.', { isLoading, isPublicPath });
    return <SplashScreen />;
  }

  console.log('AuthInitializer: isLoading is false. Rendering children or redirected.');
  return <>{children}</>;
} 