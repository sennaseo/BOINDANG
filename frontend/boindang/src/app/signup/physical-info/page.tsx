'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CaretLeft } from '@phosphor-icons/react';
import Button from '@/components/common/Button'; // 공용 버튼 컴포넌트 경로 확인 필요

export default function PhysicalInfo() {
  const router = useRouter();
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleGenderChange = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      // TODO: 입력된 신체 정보 저장 로직 (API 호출 등)
      console.log('신체 정보:', { gender, height, weight });
      router.push('/signup/type'); // 다음 단계(타입 선택)로 이동
    }
  };

  // 키, 몸무게, 성별이 모두 입력되었는지 확인
  const isFormValid = () => {
    return height.trim() !== '' && weight.trim() !== '' && gender !== '';
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white">
      {/* 뒤로가기 버튼 */}
      <div className="p-4">
        <Link href="/signup" className="inline-block">
          <CaretLeft size={24} weight="regular" className="text-gray-800" />
        </Link>
      </div>

      <div className="px-6 flex-1">
        {/* 제목 및 설명 */}
        <h1 className="text-xl font-medium mb-2 text-gray-900">신체 정보 입력</h1>
        <p className="text-gray-600 text-sm mb-10">일일 권장 섭취량 계산을 위해 아래 정보를 입력해주세요</p>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
          <div className="flex-1 space-y-8">
            {/* 성별 선택 */}
            <div>
              <p className="text-sm mb-2 font-medium text-gray-700">성별</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${gender === 'male'
                    ? 'bg-[#6C2FF2] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${gender === 'female'
                    ? 'bg-[#6C2FF2] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  여성
                </button>
              </div>
            </div>

            {/* 키 / 몸무게 입력 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm mb-2 font-medium text-gray-700">키(cm)</p>
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C2FF2] focus:border-[#6C2FF2]"
                    placeholder=""
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    cm
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm mb-2 font-medium text-gray-700">몸무게(kg)</p>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C2FF2] focus:border-[#6C2FF2]"
                    placeholder=""
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    kg
                  </span>
                </div>
              </div>
            </div>
            {/* 생년월일 입력은 디자인에 없으므로 제거 */}
          </div>
        </form>
      </div>

      {/* 하단 다음 버튼 */}
      <div className="px-6 py-5 mt-auto w-full bg-white">
        <Button
          type="button"
          text="다음"
          isDisabled={!isFormValid()}
          onClick={handleSubmit}
          // 기본 버튼 스타일 외 추가 스타일링 필요 시 className 추가
          className="w-full py-4 text-base"
        />
      </div>
    </div>
  );
}
