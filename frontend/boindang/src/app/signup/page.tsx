'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeSlash, CaretLeft, Shuffle } from '@phosphor-icons/react';
import { getRandomNickname } from '@woowa-babble/random-nickname';
import Button from '@/components/common/Button';

// 1. Zustand 스토어 import
import { useSignUpStore } from '@/stores/signupStore';

type NicknameType = 'animals' | 'heros' | 'characters' | 'monsters';

export default function SignUp() {
  const router = useRouter();

  // 2. Zustand 스토어에서 상태와 액션 가져오기
  const {
    username, // 스토어에서는 username으로 정의했습니다. API 명세와 일치.
    nickname,
    password,
    setUsername, // 스토어에서는 setUsername
    setNickname,
    setPassword,
  } = useSignUpStore();

  // 로컬 UI 상태는 useState 유지
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // React Query 훅 사용 예시는 최종 단계에서 적용 예정
  // const signUpMutation = useSignUpMutation();
  // const checkIdMutation = useCheckIdMutation();

  // 3. 핸들러 함수들에서 Zustand 액션 사용
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError('');
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
    if (confirmPassword && e.target.value !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  // 아이디 중복 확인 예시 (나중에 TanStack Query와 연동)
  /*
  const checkIdDuplicate = () => {
    if (username.trim()) { // username 사용
      // checkIdMutation.mutate(username, {
      //   onSuccess: (isAvailable) => {
      //     if (!isAvailable) {
      //       setUserIdError('이미 사용 중인 아이디입니다'); // usernameError
      //     }
      //   }
      // });
    }
  };
  */

  const generateRandomNickname = () => {
    const types: NicknameType[] = ['animals', 'heros', 'characters', 'monsters'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    try {
      const randomGenNickname = getRandomNickname(randomType);
      setNickname(randomGenNickname);
      setNicknameError('');
    } catch (error) {
      console.error('닉네임 생성 오류:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      router.push('/signup/physical-info');
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    // 모든 에러 상태 초기화
    setUsernameError('');
    setNicknameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // 아이디 유효성 검사
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setUsernameError('아이디를 입력해주세요.');
      isValid = false;
    } else if (trimmedUsername.length < 4 || trimmedUsername.length > 15) {
      setUsernameError('아이디는 4자 이상 15자 이하로 입력해주세요.');
      isValid = false;
    } else if (!/^[a-z0-9]+$/.test(trimmedUsername)) {
      setUsernameError('아이디는 영문 소문자, 숫자만 사용 가능합니다.');
      isValid = false;
    }

    // 닉네임 유효성 검사
    const nicknameValue = nickname;
    if (!nicknameValue.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      isValid = false;
    } else if (nicknameValue.length < 2 || nicknameValue.length > 20) {
      setNicknameError('닉네임은 2자 이상 20자 이하로 입력해주세요.');
      isValid = false;
    } else if (/[^a-zA-Z0-9가-힣\s]/.test(nicknameValue)) {
      setNicknameError('닉네임은 한글, 영문, 숫자, 공백만 사용 가능합니다 (특수문자 불가).');
      isValid = false;
    }

    // 비밀번호 유효성 검사
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else if (password.length < 8 || password.length > 20) {
      setPasswordError('비밀번호는 8자 이상 20자 이하로 입력해주세요.');
      isValid = false;
    } else {
      let strength = 0;
      if (/[a-zA-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[!@#$%^&*]/.test(password)) strength++;

      if (strength < 2) {
        setPasswordError('비밀번호는 영문, 숫자, 특수문자 중 2가지 이상 조합해야 합니다.');
        isValid = false;
      }
    }

    // 비밀번호 확인 유효성 검사
    if (!confirmPassword) {
      setConfirmPasswordError('비밀번호 확인을 입력해주세요.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    }

    return isValid;
  };

  const isFormValid = (): boolean => {
    const trimmedUsername = username.trim();
    const trimmedNickname = nickname.trim();

    // 모든 필드가 채워져 있는지 일차적으로 확인
    if (!trimmedUsername || !trimmedNickname || !password || !confirmPassword) {
      return false;
    }

    // 에러 메시지가 하나라도 있으면 비활성화
    // (validateForm을 버튼 클릭 시 호출하므로, isFormValid는 현재 에러 상태만 체크해도 됨)
    // 하지만, 더 정확하려면 isFormValid 내부에서 validateForm의 축약된 버전을 실행하거나,
    // validateForm이 설정한 에러 상태를 직접 참조해야 함.
    // 여기서는 모든 에러 상태가 비어있는지 + 비밀번호 일치 여부만 확인.
    // (handleSubmit에서 validateForm이 먼저 실행되므로 이 정도도 괜찮을 수 있음)
    return usernameError === '' &&
      nicknameError === '' &&
      passwordError === '' &&
      confirmPasswordError === '' &&
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
                value={username}
                onChange={handleUsernameChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                aria-describedby={usernameError ? "username-error" : undefined}
              />
              {usernameError && (
                <p id="username-error" className="text-red-500 text-xs mt-1">{usernameError}</p>
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
                  aria-describedby={nicknameError ? "nickname-error" : undefined}
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
              {nicknameError && (
                <p id="nickname-error" className="text-red-500 text-xs mt-1">{nicknameError}</p>
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
                  aria-describedby={passwordError ? "password-error" : undefined}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
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
              {passwordError && (
                <p id="password-error" className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>

            <div className="mb-8">
              <p className="text-sm mb-2">비밀번호 확인</p>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none pr-10"
                  aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
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
                <p id="confirm-password-error" className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
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
