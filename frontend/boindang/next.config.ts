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
      'boindang.s3.ap-northeast-2.amazonaws.com',
    ],
  },
  /* config options here */
};

export default withPWA(nextConfig);
