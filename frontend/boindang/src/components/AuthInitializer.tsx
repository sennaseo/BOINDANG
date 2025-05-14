"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import SplashScreen from './SplashScreen';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const splashShownSessionKey = 'splashAlreadyShown';

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

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
      if (isLoggedIn) {
        console.log('AuthInitializer: User is logged in. Allowing access.');
      } else {
        console.log('AuthInitializer: User is not logged in. Redirecting to /onboarding.');
        router.replace('/onboarding');
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
  }, [isLoggedIn, isHydrated, router, hasSplashBeenShown]);

  if (isLoading) {
    console.log('AuthInitializer: isLoading is true, showing SplashScreen.');
    return <SplashScreen />;
  }

  console.log('AuthInitializer: isLoading is false. Rendering children or redirected.');
  return <>{children}</>;
} 