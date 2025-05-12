'use client'; // 이 파일은 클라이언트 컴포넌트입니다.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
      mutations: {
        // 전역 뮤테이션 기본 옵션 (필요하다면)
      }
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
