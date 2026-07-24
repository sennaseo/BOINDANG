// 이미지(OCR 업로드 결과 등) 서빙용 CloudFront 베이스 URL.
// 환경변수 NEXT_PUBLIC_CDN_BASE_URL로 오버라이드 가능하며, 미설정 시 기존 도메인으로 폴백.
export const CDN_BASE_URL =
  process.env.NEXT_PUBLIC_CDN_BASE_URL || 'https://d1d5plumlg2gxc.cloudfront.net';
