import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface SignUpData {
  userId: string;
  nickname: string;
  password: string;
}

interface TypeData {
  userId: string;
  userType: 'diet' | 'fitness' | 'diabetes' | 'kidney';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.boindang.com';

// 회원 기본 정보 등록
export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      return response.data;
    },
    onError: (error) => {
      console.error('회원가입 중 오류 발생:', error);
      // 오류 처리 로직
    }
  });
};

// 사용자 타입 등록
export const useSetUserTypeMutation = () => {
  return useMutation({
    mutationFn: async (data: TypeData) => {
      const response = await axios.post(`${API_URL}/users/type`, data);
      return response.data;
    },
    onError: (error) => {
      console.error('사용자 타입 설정 중 오류 발생:', error);
      // 오류 처리 로직
    }
  });
};

// 아이디 중복 확인
export const useCheckIdMutation = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axios.get(`${API_URL}/auth/check-id?userId=${userId}`);
      return response.data.isAvailable;
    },
    onError: (error) => {
      console.error('아이디 중복 확인 중 오류 발생:', error);
      // 오류 처리 로직
    }
  });
}; 