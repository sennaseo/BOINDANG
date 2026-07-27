import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  images: {
    domains: [
      'd1d5plumlg2gxc.cloudfront.net',
      // CDN 베이스가 env 로 바뀌면 (예: S3 직접 서빙) 그 호스트도 허용
      ...(process.env.NEXT_PUBLIC_CDN_BASE_URL ? [new URL(process.env.NEXT_PUBLIC_CDN_BASE_URL).hostname] : []),
    ],
  },
  compiler: {
    // 프로덕션 빌드에서 console.* 제거 (error/warn은 유지)
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default withPWA(nextConfig);
