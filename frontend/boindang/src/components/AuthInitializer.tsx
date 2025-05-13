"use client";

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

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
        console.log('AuthInitializer: Zustand store rehydration finished.');
        setIsHydrated(true);
      });

      if (useAuthStore.persist.hasHydrated()) {
        console.log('AuthInitializer: Store rehydrated synchronously before subscription setup.');
        setIsHydrated(true);
        unsubFinishHydration();
      }

      return () => {
        unsubFinishHydration();
      };
    }
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      console.log('AuthInitializer: Waiting for store hydration...');
      return;
    }

    console.log('AuthInitializer: Store is hydrated. Starting 1-second splash delay...');

    const splashTimer = setTimeout(() => {
      console.log('AuthInitializer: Splash delay finished. Checking auth state...', { isLoggedIn });

      if (isLoggedIn) {
        console.log('AuthInitializer: User is logged in. Hiding splash screen.');
        setIsLoading(false);
      } else {
        console.log('AuthInitializer: User is not logged in. Redirecting to /onboarding.');
        router.replace('/onboarding');
        setIsLoading(false);
      }
    }, 1000);

    return () => {
      clearTimeout(splashTimer);
    };
  }, [isLoggedIn, isHydrated, router]);

  if (isLoading) {
    console.log('AuthInitializer: isLoading is true, showing SplashScreen.', { isHydrated });
    return <SplashScreen />;
  }

  console.log('AuthInitializer: isLoading is false. Rendering children or redirected.');
  return <>{children}</>;
} 