import apiClient from '@/lib/apiClient';
import type {
  SignUpRequestPayload,
  SignUpResponse,
} from  '@/types/api/authTypes';

/**
 * 회원가입 API 요청 함수
 * @param userData 회원가입에 필요한 사용자 데이터 (SignUpRequestPayload 타입)
 * @returns Promise<SignUpResponse> API 응답 전체를 반환
 */

export const postSignUp = async (userData: SignUpRequestPayload) : Promise<SignUpResponse> => {
  // apiClient (우리 배)를 사용해서 '/signup' 경로로 POST 요청을 보냅니다.
  // userData (화물)도 함께 보냅니다.
  // 서버로부터 SignUpResponse 형태의 응답을 기대합니다.
  const response = await apiClient.post<SignUpResponse>('/user/signup', userData);
  return response.data; // axios는 실제 응답 데이터를 'data' 속에 담아줍니다.
}

