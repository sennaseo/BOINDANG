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
      } else if (isLoggedIn && isPublicPath) {
        // 반대 방향도 막는다: 로그인 상태로 온보딩/로그인/가입에 들어오면 홈으로.
        // 이걸 안 하면 앱 첫 진입에서 온보딩이 한 프레임 그려졌다 사라진다.
        console.log('AuthInitializer: Already logged in on a public path. Redirecting to /.');
        router.replace('/');
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

  // 리다이렉트가 끝날 때까지 스플래시를 유지한다. 양방향 모두 —
  //  ① 비로그인 + 보호 경로 → 온보딩으로 가는 중
  //  ② 로그인 + 공개 경로   → 홈으로 가는 중 (이게 없으면 온보딩이 한 프레임 번쩍)
  const isRedirecting = isHydrated && (isLoggedIn ? isPublicPath : !isPublicPath);

  if (isLoading || isRedirecting) {
    console.log('AuthInitializer: showing SplashScreen.', { isLoading, isRedirecting, isPublicPath });
    return <SplashScreen />;
  }

  console.log('AuthInitializer: isLoading is false. Rendering children or redirected.');
  return <>{children}</>;
} 