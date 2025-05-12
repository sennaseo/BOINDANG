'use client';

import { useState } from 'react';
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
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleSubmit = () => {
    if (selectedType) {
      // 여기서 선택된 타입을 API로 전송하거나 다음 페이지로 전달
      // 회원가입 완료 페이지로 이동
      router.push('/signup/complete');
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="p-4">
        <Link href="/signup" className="inline-block">
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
            isSelected={selectedType === 'diet'}
            onClick={() => setSelectedType('diet')}
          />

          <TypeCard
            type="fitness"
            title="근력 운동"
            description="근육 성장이나 운동 능력 향상을 위한 식단을 원해요"
            icon={<Barbell size={48} weight="fill" />}
            isSelected={selectedType === 'fitness'}
            onClick={() => setSelectedType('fitness')}
          />

          <TypeCard
            type="diabetes"
            title="당뇨 관리"
            description="혈당 조절을 위한 맞춤 영양 정보가 중요해요"
            icon={<Heartbeat size={48} weight="fill" />}
            isSelected={selectedType === 'diabetes'}
            onClick={() => setSelectedType('diabetes')}
          />

          <TypeCard
            type="kidney"
            title="신장 질환 관리"
            description="특정 영양소(나트륨, 칼륨 등) 조절이 필요해요"
            icon={<FirstAidKit size={48} weight="fill" />}
            isSelected={selectedType === 'kidney'}
            onClick={() => setSelectedType('kidney')}
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
          text="완료"
          isDisabled={!selectedType}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
} 