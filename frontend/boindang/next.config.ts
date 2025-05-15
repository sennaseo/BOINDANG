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
      'boindang.s3.ap-northeast-2.amazonaws.com',
      'd1d5plumlg2gxc.cloudfront.net',
    ],
  },
  /* config options here */
};

export default withPWA(nextConfig);
