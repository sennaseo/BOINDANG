'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeSlash, CaretLeft } from '@phosphor-icons/react';

export default function SignUp() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userIdError, setUserIdError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    setUserIdError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 회원가입 API 호출 로직 추가
    router.push('/login');
  };

  const checkValidation = () => {
    // 아이디가 'dmscks3126'인 경우 에러 메시지 표시
    if (userId === 'dmscks3126') {
      setUserIdError('이미 존재하는 아이디입니다');
    }

    // 비밀번호와 비밀번호 확인이 다를 경우 에러 메시지 표시
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다');
    }
  };

  return (
    <>
      <div className="p-4">
        <Link href="/login" className="inline-block">
          <CaretLeft size={24} weight="regular" />
        </Link>
      </div>

      <div className="px-6">
        <h1 className="text-xl font-medium mb-2">아이디 / 비밀번호 입력</h1>
        <p className="text-gray-600 text-sm mb-8">원활한 서비스 이용을 위해 ID/PW를 입력해주세요</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <p className="text-sm mb-2">아이디</p>
            <input
              type="text"
              value={userId}
              onChange={handleUserIdChange}
              onBlur={checkValidation}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
            />
            {userIdError && (
              <p className="text-red-500 text-xs mt-1">{userIdError}</p>
            )}
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
                onBlur={checkValidation}
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

          <div className="fixed bottom-0 left-0 right-0 bg-white p-5 md:static md:p-0 md:mt-16">
            <button
              type="submit"
              className="w-full p-3 bg-gray-400 text-white rounded-md"
            >
              다음
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
