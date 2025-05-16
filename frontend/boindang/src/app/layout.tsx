import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from 'react-hot-toast';

// QueryProvider import
import QueryProvider from "@/components/providers/QueryProvider"; // 경로 확인!
import AuthInitializer from "@/components/AuthInitializer"; // AuthInitializer 임포트 추가

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 이 metadata가 서버 컴포넌트이므로 최상단에 'use client' 지시어를 추가하면 안됩니다
export const metadata: Metadata = {
  title: "보인당",
  description: "보인당 앱",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "보인당",
  },
  applicationName: "보인당",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // QueryClient 관련 로직은 QueryProvider로 이동했습니다.
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable} antialiased font-pretendard`}
      >
        {/* 새로 만든 QueryProvider로 children을 감싸줍니다. */}
        <QueryProvider>
          {/* AuthInitializer로 감싸서 인증 상태 확인 */}
          <AuthInitializer>
            <div className="w-full md:mx-auto md:max-w-[440px] min-h-screen bg-white shadow-xl border-x-2 border-gray-100">
              <main>
                {children}
              </main>
            </div>
          </AuthInitializer>
        </QueryProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}