'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash, Shuffle, CheckCircle } from '@phosphor-icons/react'; // 아이콘 추가
import { getRandomNickname } from '@woowa-babble/random-nickname';
import Button from '@/components/common/Button';
import { useCheckUsername } from '@/hooks/useAuthMutations';
import ConfirmModal from '@/components/common/ConfirmModal';
import BackArrowIcon from '@/components/common/BackArrowIcon';

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
    resetSignUpForm, // 데이터 초기화 액션 추가
  } = useSignUpStore();

  // 로컬 UI 상태는 useState 유지
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // 모달 상태 추가

  // Touched 상태 추가
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // React Query 훅 사용 예시는 최종 단계에서 적용 예정
  // const signUpMutation = useSignUpMutation();
  // const checkIdMutation = useCheckIdMutation();

  // --- useRef 추가: 컴포넌트 마운트 여부 추적 ---
  const isMounted = useRef(false);
  // --- useRef 추가 끝 ---

  // 3. 핸들러 함수들에서 Zustand 액션 사용
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError('');
    setIsUsernameChecked(false);
    setIsUsernameAvailable(null);
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
    if (isMounted.current) validateForm();
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
    if (isMounted.current) validateForm();
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
      setNicknameTouched(true); // 랜덤 생성 시 touched 처리
    } catch (error) {
      console.error('닉네임 생성 오류:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 제출 시 모든 필드를 touched 상태로 만듦
    setUsernameTouched(true);
    setNicknameTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    const isFormCurrentlyValid = validateForm(true); // Pass true to force validation of all fields

    if (isFormCurrentlyValid && isUsernameChecked && isUsernameAvailable === true) {
      router.push('/signup/physical-info');
    } else if (!isUsernameChecked || isUsernameAvailable !== true) {
      // Ensure username check error is displayed if it's the issue
      if (!isUsernameChecked && username.trim() && (!usernameError || usernameError === '아이디 중복 확인을 해주세요.') ) {
        setUsernameError('아이디 중복 확인을 해주세요.');
      } else if (isUsernameAvailable === false && username.trim()){
        setUsernameError('이미 사용 중인 아이디입니다.');
      }
      // Other errors are set by validateForm(true)
    }
  };

  const validateForm = (forceValidate: boolean = false): boolean => {
    let overallIsValid = true;

    // Username Validation
    const trimmedUsername = username.trim();
    let currentUsernameError: string | null = usernameError; 
    if (forceValidate || usernameTouched) {
      if (!trimmedUsername) {
        currentUsernameError = '아이디를 입력해주세요.';
        overallIsValid = false;
      } else if (trimmedUsername.length < 4 || trimmedUsername.length > 15) {
        currentUsernameError = '아이디는 4자 이상 15자 이하로 입력해주세요.';
        overallIsValid = false;
      } else if (!/^[a-z0-9]+$/.test(trimmedUsername)) {
        currentUsernameError = '아이디는 영문 소문자, 숫자만 사용 가능합니다.';
        overallIsValid = false;
      } else if (isUsernameChecked && isUsernameAvailable === true) {
        currentUsernameError = null; // Valid and checked
      } else if (isUsernameAvailable === false) { // Checked and duplicate
        currentUsernameError = '이미 사용 중인 아이디입니다.';
        overallIsValid = false;
      } else if (forceValidate && !isUsernameChecked) { // Submitted without checking
        currentUsernameError = '아이디 중복 확인을 해주세요.';
        overallIsValid = false;
      } else if (!forceValidate && !isUsernameChecked && usernameTouched && trimmedUsername) {
        // User touched and typed, but not yet clicked check duplicate. No error yet unless submitting.
        // Or, if an old error like "중복 확인 해주세요" exists from previous submit, clear it if not submitting now.
        if (currentUsernameError === '아이디 중복 확인을 해주세요.') currentUsernameError = null;
      } else if (!trimmedUsername && usernameTouched) {
        currentUsernameError = '아이디를 입력해주세요.'; // Ensure empty touched field shows error
        overallIsValid = false;
      }
    } else {
      currentUsernameError = null; // Not touched, not submitting: clear error
    }
    setUsernameError(currentUsernameError);

    // Nickname Validation
    const nicknameValue = nickname;
    let currentNicknameError = '';
    if (forceValidate || nicknameTouched) {
      if (!nicknameValue.trim()) {
        currentNicknameError = '닉네임을 입력해주세요.';
        overallIsValid = false;
      } else if (nicknameValue.length < 2 || nicknameValue.length > 20) {
        currentNicknameError = '닉네임은 2자 이상 20자 이하로 입력해주세요.';
        overallIsValid = false;
      } else if (/[^a-zA-Z0-9가-힣\s]/.test(nicknameValue)) {
        currentNicknameError = '닉네임은 한글, 영문, 숫자, 공백만 사용 가능합니다 (특수문자 불가).';
        overallIsValid = false;
      } else {
        currentNicknameError = ''; // Valid
      }
    } else {
      currentNicknameError = ''; // Not touched, not submitting: clear error
    }
    setNicknameError(currentNicknameError);

    // Password Validation
    let currentPasswordErrorVal = '';
    if (forceValidate || passwordTouched) {
      if (!password) {
        currentPasswordErrorVal = '비밀번호를 입력해주세요.';
        overallIsValid = false;
      } else if (password.length < 8 || password.length > 20) {
        currentPasswordErrorVal = '비밀번호는 8자 이상 20자 이하로 입력해주세요.';
        overallIsValid = false;
      } else {
        let strength = 0;
        if (/[a-zA-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        if (strength < 2) {
          currentPasswordErrorVal = '비밀번호는 영문, 숫자, 특수문자 중 2가지 이상 조합해야 합니다.';
          overallIsValid = false;
        } else {
          currentPasswordErrorVal = ''; // Valid
        }
      }
    } else {
      currentPasswordErrorVal = ''; // Not touched, not submitting: clear error
    }
    setPasswordError(currentPasswordErrorVal);

    // Confirm Password Validation
    let currentConfirmPasswordErrorVal = '';
    if (forceValidate || confirmPasswordTouched) {
      if (!confirmPassword && password) { // Only show error if main password has been entered
        currentConfirmPasswordErrorVal = '비밀번호 확인을 입력해주세요.';
        overallIsValid = false;
      } else if (password && confirmPassword && password !== confirmPassword) {
        currentConfirmPasswordErrorVal = '비밀번호가 일치하지 않습니다.';
        overallIsValid = false;
      } else if (password && confirmPassword && password === confirmPassword) {
        currentConfirmPasswordErrorVal = ''; // Valid and matches
      } else if (!password && confirmPasswordTouched) { // Touched confirm but no main password
        currentConfirmPasswordErrorVal = '비밀번호를 먼저 입력해주세요.'; // Or just clear if not submitting
        if (!forceValidate) currentConfirmPasswordErrorVal = '';
        else overallIsValid = false;
      }
    } else {
      currentConfirmPasswordErrorVal = ''; // Not touched, not submitting: clear error
    }
    setConfirmPasswordError(currentConfirmPasswordErrorVal);
    
    // If password itself is invalid, overall form is not valid, even if confirm matches an invalid password.
    if (currentPasswordErrorVal) overallIsValid = false;

    return overallIsValid;
  };

  const isFormValid = (): boolean => {
    // This function is primarily for the submit button's disabled state.
    // It should reflect whether the form *could* be submitted if all checks pass.
    // The actual validation happens in validateForm and handleCheckUsername.
    const trimmedUsername = username.trim();
    const trimmedNickname = nickname.trim();
    return (
      !!trimmedUsername &&
      !!trimmedNickname &&
      !!password &&
      !!confirmPassword &&
      !usernameError && // Error states should be up-to-date from validateForm
      !nicknameError &&
      !passwordError &&
      !confirmPasswordError &&
      password === confirmPassword &&
      isUsernameChecked &&
      isUsernameAvailable === true
    );
  };

  // --- 아이디 중복 확인 로직 추가 ---
  const checkUsernameMutation = useCheckUsername(); // 훅 인스턴스화
  const [isUsernameChecked, setIsUsernameChecked] = useState(false); // 중복 확인 실행 여부 상태
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null); // 아이디 사용 가능 여부 상태 (null: 확인 전, true: 사용 가능, false: 사용 불가)
  // --- 로직 추가 끝 ---

  // --- 아이디 중복 확인 핸들러 함수 추가 ---
  const handleCheckUsername = () => {
    setUsernameTouched(true);
    const trimmedUsername = username.trim();
    // Client-side validation before API call
    if (!trimmedUsername) {
      setUsernameError('아이디를 입력해주세요.');
      return;
    } else if (trimmedUsername.length < 4 || trimmedUsername.length > 15) {
      setUsernameError('아이디는 4자 이상 15자 이하로 입력해주세요.');
      return;
    } else if (!/^[a-z0-9]+$/.test(trimmedUsername)) {
      setUsernameError('아이디는 영문 소문자, 숫자만 사용 가능합니다.');
      return;
    }
    setUsernameError(null); // Clear previous client-side errors before mutation

    checkUsernameMutation.mutate(trimmedUsername, {
      onSuccess: (data) => {
        setIsUsernameChecked(true);
        if (data.success && data.data === true) { // API says username is duplicate (data.data === true means exists)
          setIsUsernameAvailable(false);
          setUsernameError('이미 사용 중인 아이디입니다.');
        } else if (data.success && data.data === false) { // API says username is available
          setIsUsernameAvailable(true);
          setUsernameError(null); // Clear error, show success message via JSX
        } else { // API call succeeded but response indicates an issue
          setIsUsernameAvailable(false);
          setUsernameError(data.error?.message || '아이디 사용 가능 여부를 확인할 수 없습니다.');
        }
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || '아이디 확인 중 오류가 발생했습니다.';
        setUsernameError(errorMessage);
        setIsUsernameChecked(false);
        setIsUsernameAvailable(null);
      },
    });
  };
  // --- 핸들러 함수 추가 끝 ---

  // 뒤로가기 버튼 클릭 핸들러
  const handleBackNavigation = () => {
    if (username || nickname || password) {
      setIsConfirmModalOpen(true); // window.confirm 대신 모달 열기
    } else {
      router.push('/login');
    }
  };

  // 모달 확인 버튼 클릭 시
  const handleModalConfirm = () => {
    resetSignUpForm();
    router.push('/login');
    setIsConfirmModalOpen(false);
  };

  // 모달 취소 버튼 클릭 시 또는 외부 클릭 시
  const handleModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  // --- 실시간 유효성 검사 추가 ---
  useEffect(() => {
    if (isMounted.current) {
      validateForm(); 
    } else {
      isMounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, nickname, password, confirmPassword]); // validateForm is not in deps to avoid loops

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="p-4">
        <button onClick={handleBackNavigation} className="inline-block">
          <BackArrowIcon size={24} weight="regular" />
        </button>
      </div>

      <div className="px-6 flex-1">
        <h1 className="text-xl font-medium mb-2">아이디 / 비밀번호 입력</h1>
        <p className="text-gray-600 text-sm mb-8">원활한 서비스 이용을 위해 ID/PW를 입력해주세요</p>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1">
            <div className="mb-8">
              <p className="text-sm mb-2">아이디</p>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={() => { setUsernameTouched(true); if(isMounted.current) validateForm(); }} // Validate on blur
                    className={`w-full p-3 border rounded-md focus:outline-none ${usernameError && !checkUsernameMutation.isPending ? 'border-red-500' : 'border-gray-300'}`}
                    aria-describedby="username-feedback"
                  />
                  <div id="username-feedback" className="mt-1 text-xs h-4">
                    {checkUsernameMutation.isPending ? (
                      <p className="text-gray-500">확인 중...</p>
                    ) : usernameError ? (
                      <p className="text-red-500">{usernameError}</p>
                    ) : isUsernameChecked && isUsernameAvailable === true ? (
                      <p className="text-green-600 flex items-center gap-1">
                        <CheckCircle size={14} weight="fill" /> 사용 가능한 아이디입니다.
                      </p>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCheckUsername}
                  disabled={checkUsernameMutation.isPending || !username.trim()}
                  className="shrink-0 mt-[1px] py-3 px-4 bg-[#8652EE] text-white rounded-md hover:bg-[#6C2FF2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {checkUsernameMutation.isPending ? '확인중' : '중복확인'}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm mb-2">닉네임</p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  onBlur={() => { setNicknameTouched(true); if(isMounted.current) validateForm(); }} // Validate on blur
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
                  onBlur={() => { setPasswordTouched(true); if(isMounted.current) validateForm(); }} // Validate on blur
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none pr-10"
                  aria-describedby={passwordError ? "password-error" : "password-hint"}
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
              <p id="password-hint" className="text-xs text-gray-500 mt-1">
                8~20자, 영문, 숫자, 특수문자 중 2가지 이상 조합
              </p>
              {passwordTouched && password && !passwordError && (
                <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                  <CheckCircle size={14} weight="fill" /> 사용 가능한 비밀번호입니다.
                </p>
              )}
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
                  onBlur={() => { setConfirmPasswordTouched(true); if(isMounted.current) validateForm(); }} // Validate on blur
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
              {confirmPasswordTouched && confirmPassword && !confirmPasswordError && password === confirmPassword && (
                 <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                   <CheckCircle size={14} weight="fill" /> 비밀번호가 일치합니다.
                 </p>
              )}
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

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title="페이지 나가기"
        message="입력한 내용이 저장되지 않습니다. 정말로 뒤로 가시겠습니까?"
        confirmText="나가기"
        cancelText="취소"
      />
    </div>
  );
}
