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
      'd1d5plumlg2gxc.cloudfront.net'
    ],
  },
  compiler: {
    // 프로덕션 빌드에서 console.* 제거 (error/warn은 유지)
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default withPWA(nextConfig);
