'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CaretLeft,
  Scales,
  Barbell,
  Heartbeat,
  FirstAidKit
} from '@phosphor-icons/react';
import Button from '@/components/common/Button';

// 1. Zustand 스토어 import
import { useSignUpStore } from '@/stores/signupStore';
// 2. TanStack Query 뮤테이션 훅 import
import { useSignUp } from '@/hooks/useAuthMutations';
// 3. API 요청 타입 import
import type { SignUpRequestPayload } from '@/types/api/authTypes';

type UserType = 'diet' | 'fitness' | 'diabetes' | 'kidney';

interface TypeCardProps {
  type: UserType;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const TypeCard: React.FC<TypeCardProps> = ({ title, description, icon, isSelected, onClick }) => {
  return (
    <div
      className={`border rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-colors ${isSelected ? 'border-[#6C2FF2] bg-[#F5F1FF]' : 'border-gray-200'
        }`}
      onClick={onClick}
    >
      <div className={`mb-4 ${isSelected ? 'text-[#6C2FF2]' : 'text-[#6C2FF2]'}`}>
        {icon}
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default function SignUpType() {
  const router = useRouter();

  // 4. Zustand 스토어에서 모든 상태와 액션 가져오기
  const {
    username,
    password,
    nickname,
    gender,
    height,
    weight,
    userType, // 현재 페이지에서 선택/확인하는 userType
    resetSignUpForm, // 회원가입 성공 후 폼 초기화용
    setUserType      // 현재 페이지에서 userType 설정용
  } = useSignUpStore();

  // 5. 회원가입 뮤테이션 훅 사용
  const signUpMutation = useSignUp();

  // 6. handleSubmit 함수 수정
  const handleSubmit = () => {
    // userType이 선택되었는지, 그리고 스토어에 다른 필수 값들이 있는지 한번 더 확인 (간단한 예시)
    if (!userType || !username || !password || !nickname || !gender || !height || !weight) {
      alert('모든 정보를 올바르게 입력해주세요.'); // 실제 프로덕션에서는 더 나은 UI로 처리
      return;
    }

    // API 요청을 위한 데이터 준비
    const payload: SignUpRequestPayload = {
      username,
      password,
      nickname,
      userType, // 스토어의 userType이 API가 기대하는 '다이어트', '근력운동' 등의 문자열
      gender,   // 스토어의 gender는 'M' 또는 'F'
      height: parseInt(height, 10), // 문자열을 숫자로 변환
      weight: parseInt(weight, 10), // 문자열을 숫자로 변환
    };

    // 키와 몸무게 변환 시 NaN 체크 (간단한 예시)
    if (isNaN(payload.height) || isNaN(payload.weight)) {
      alert('키와 몸무게는 숫자로 입력해주세요.');
      return;
    }

    console.log('Signup Payload:', payload); // 페이로드 로깅 추가
    // 회원가입 API 호출
    signUpMutation.mutate(payload, {
      onSuccess: (data) => {
        console.log('회원가입 성공:', data);
        // alert('회원가입에 성공했습니다!'); // 사용자에게 성공 알림
        resetSignUpForm(); // Zustand 스토어 초기화
        router.push('/signup/complete'); // 완료 페이지로 이동
      },
      onError: (error) => {
        console.error('회원가입 실패:', error);
        // error.response.data가 ApiErrorResponse 타입일 것으로 예상
        const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
        alert(`회원가입 실패: ${errorMessage}`); // 사용자에게 에러 알림
      },
    });
  };

  // 완료 버튼 비활성화 조건에 로딩 상태 추가
  const isButtonDisabled = !userType || signUpMutation.isPending;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="p-4">
        <Link href="/signup/physical-info" className="inline-block">
          <CaretLeft size={24} weight="regular" />
        </Link>
      </div>

      <div className="px-6 flex-1">
        <h1 className="text-xl font-medium mb-2">어떤 목표를 가지고 계신가요?</h1>
        <p className="text-gray-600 text-sm mb-8">
          목표에 맞춰 개인 맞춤 리포트를 제공해 드릴게요<br />
          (나중에 프로필에서 변경할 수 있어요)
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <TypeCard
            type="diet"
            title="다이어트"
            description="체중 감량 또는 유지를 위한 식단 관리가 필요해요"
            icon={<Scales size={48} weight="fill" />}
            isSelected={userType === '다이어트'}
            onClick={() => setUserType('다이어트')}
          />

          <TypeCard
            type="fitness"
            title="근력 운동"
            description="근육 성장이나 운동 능력 향상을 위한 식단을 원해요"
            icon={<Barbell size={48} weight="fill" />}
            isSelected={userType === '근성장'}
            onClick={() => setUserType('근성장')}
          />

          <TypeCard
            type="diabetes"
            title="당뇨 관리"
            description="혈당 조절을 위한 맞춤 영양 정보가 중요해요"
            icon={<Heartbeat size={48} weight="fill" />}
            isSelected={userType === '당뇨병'}
            onClick={() => setUserType('당뇨병')}
          />

          <TypeCard
            type="kidney"
            title="신장 질환 관리"
            description="특정 영양소(나트륨, 칼륨 등) 조절이 필요해요"
            icon={<FirstAidKit size={48} weight="fill" />}
            isSelected={userType === '신장질환'}
            onClick={() => setUserType('신장질환')}
          />
        </div>

        <p className="text-center text-xs text-gray-500 mb-8">
          선택하신 정보는 맞춤형 영양 분석에만 사용되며<br />
          언제든지 변경 가능합니다
        </p>
      </div>

      <div className="px-6 py-5 w-full bg-white">
        <Button
          type="button"
          text={signUpMutation.isPending ? "처리 중..." : "완료"}
          isDisabled={isButtonDisabled}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
} 