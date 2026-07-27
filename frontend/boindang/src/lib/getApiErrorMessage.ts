import axios from 'axios';

/**
 * axios 에러(4xx/5xx)에서 백엔드가 내려준 사용자용 메시지를 추출한다.
 * 백엔드 에러 바디는 두 가지 형태:
 *  - 표준: { success:false, error:{ status, message } }
 *  - user 서비스 일부: { success:false, code, message }
 * 어느 쪽이든 message를 꺼내고, 없으면 undefined.
 */
export function getApiErrorMessage(e: unknown): string | undefined {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as
      | { error?: { message?: string }; message?: string }
      | undefined;
    return data?.error?.message ?? data?.message;
  }
  return undefined;
}
