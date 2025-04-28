'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeSlash, CaretLeft, Shuffle } from '@phosphor-icons/react';
import { getRandomNickname } from '@woowa-babble/random-nickname';
import Button from '@/components/common/Button';
// React Query를 사용하려면 다음과 같은 import가 필요합니다
// import { useSignUpMutation, useCheckIdMutation } from '@/hooks/useSignUp';

type NicknameType = 'animals' | 'heros' | 'characters' | 'monsters';

export default function SignUp() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userIdError, setUserIdError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // React Query 훅 사용 예시 (패키지 설치 후 주석 해제)
  // const signUpMutation = useSignUpMutation();
  // const checkIdMutation = useCheckIdMutation();

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    setUserIdError('');
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError('');
  };

  // 아이디 중복 확인 예시 (패키지 설치 후 주석 해제)
  /* 
  const checkIdDuplicate = () => {
    if (userId.trim()) {
      checkIdMutation.mutate(userId, {
        onSuccess: (isAvailable) => {
          if (!isAvailable) {
            setUserIdError('이미 사용 중인 아이디입니다');
          }
        }
      });
    }
  };
  */

  const generateRandomNickname = () => {
    // 랜덤으로 닉네임 타입 선택
    const types: NicknameType[] = ['animals', 'heros', 'characters', 'monsters'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    try {
      const randomNickname = getRandomNickname(randomType);
      setNickname(randomNickname);
    } catch (error) {
      console.error('닉네임 생성 오류:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 유효성 검사
    if (validateForm()) {
      // React Query를 사용한 서버 요청 예시 (패키지 설치 후 주석 해제)
      /*
      signUpMutation.mutate(
        {
          userId,
          nickname,
          password
        },
        {
          onSuccess: (data) => {
            // 회원가입 성공 시 다음 단계로 이동
            sessionStorage.setItem('userId', userId); // 임시 저장
            router.push('/signup/type');
          },
          onError: (error) => {
            // 에러 처리
            console.error('회원가입 오류:', error);
            // 에러 메시지 표시 로직
          }
        }
      );
      */

      // 다음 단계(타입 선택 페이지)로 이동 - 실제 API 연동 전까지 사용
      router.push('/signup/type');
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    let isValid = true;

    // 비밀번호와 비밀번호 확인이 다를 경우 에러 메시지 표시
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다');
      isValid = false;
    }

    return isValid;
  };

  // 폼이 유효한지 여부
  const isFormValid = () => {
    return userId.trim() !== '' &&
      nickname.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword;
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="p-4">
        <Link href="/login" className="inline-block">
          <CaretLeft size={24} weight="regular" />
        </Link>
      </div>

      <div className="px-6 flex-1">
        <h1 className="text-xl font-medium mb-2">아이디 / 비밀번호 입력</h1>
        <p className="text-gray-600 text-sm mb-8">원활한 서비스 이용을 위해 ID/PW를 입력해주세요</p>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1">
            <div className="mb-8">
              <p className="text-sm mb-2">아이디</p>
              <input
                type="text"
                value={userId}
                onChange={handleUserIdChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
              />
              {userIdError && (
                <p className="text-red-500 text-xs mt-1">{userIdError}</p>
              )}
            </div>

            <div className="mb-8">
              <p className="text-sm mb-2">닉네임</p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  className="flex-1 min-w-0 p-3 border border-gray-300 rounded-md focus:outline-none text-sm"
                  placeholder="닉네임을 입력하거나 생성하세요"
                />
                <button
                  type="button"
                  onClick={generateRandomNickname}
                  className="shrink-0 py-3 px-4 bg-[#6C2FF2] text-white rounded-md hover:bg-[#5926c9] transition-colors flex items-center gap-1"
                >
                  <Shuffle size={14} weight="bold" />
                  <span className="text-xs">랜덤</span>
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-1 break-words">
                재미있는 닉네임을 생성해보세요. (동물, 영웅, 캐릭터, 몬스터)
              </p>
            </div>

            <div className="mb-8">
              <p className="text-sm mb-2">비밀번호</p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlash size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm mb-2">비밀번호 확인</p>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlash size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="px-6 py-5 w-full bg-white">
        <Button
          type="button"
          text="다음"
          isDisabled={!isFormValid()}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
