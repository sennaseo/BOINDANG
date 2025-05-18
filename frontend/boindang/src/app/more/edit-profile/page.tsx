'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Barbell, FirstAidKit, FloppyDisk, Heartbeat, Scales } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import { getUserInfo, updateUserProfile } from '@/api/auth';
import type { UserProfileUpdatePayload, UserTypeApi } from '@/types/api/authTypes';
import type { ApiResponse } from '@/types/api';
import BackArrowIcon from '@/components/common/BackArrowIcon';

type UserType = '다이어트' | '근성장' | '당뇨병' | '신장질환';

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
        className={`bg-white border shadow-sm rounded-xl p-5 flex flex-col items-center text-center cursor-pointer transition-colors ${isSelected ? 'border-[#6C2FF2] bg-[#F5F1FF]' : 'border-gray-200'
          }`}
        onClick={onClick}
      >
        <div className={`mb-2 ${isSelected ? 'text-[#6C2FF2]' : 'text-[#6C2FF2]'}`}>
          {icon}
        </div>
        <h3 className="font-bold mb-2 text-[#363636]">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    );
  };
  
export default function EditProfilePage() {
  const router = useRouter();
  const [initialUserInfo, setInitialUserInfo] = useState<ApiResponse<UserProfileUpdatePayload> | null>(null);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [selectedUserType, setSelectedUserType] = useState<UserTypeApi | '' >('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialUserInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserInfo();
        if (response && response.success && response.data) {
          setInitialUserInfo(response);
          setHeight(response.data.height?.toString() || '');
          setWeight(response.data.weight?.toString() || '');
          setSelectedUserType(response.data.userType || '');
        } else {
          setError(response.error?.message || '사용자 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터 로딩 중 오류 발생');
      }
      setLoading(false);
    };
    fetchInitialUserInfo();
  }, []);

  const handleSave = async () => {
    if (!initialUserInfo) {
      setError('기존 사용자 정보가 없습니다. 다시 시도해주세요.');
      return;
    }

    const numHeight = parseFloat(height);
    const numWeight = parseFloat(weight);

    if (isNaN(numHeight) || numHeight <= 0) {
      setError('유효한 키를 입력해주세요.');
      return;
    }
    if (isNaN(numWeight) || numWeight <= 0) {
      setError('유효한 몸무게를 입력해주세요.');
      return;
    }
    if (!selectedUserType) {
        setError('사용자 유형을 선택해주세요.');
        return;
    }

    const payload: UserProfileUpdatePayload = {
        height: numHeight,
        weight: numWeight,
        userType: selectedUserType,
        // 변경되지 않은 값도 포함하여 전송할지, 변경된 값만 보낼지는 API 명세에 따름
        // 여기서는 필수적인 세 값만 업데이트 한다고 가정
        // nickname: initialUserInfo.nickname, // 닉네임은 유지
        // gender: initialUserInfo.gender,     // 성별은 유지
    };

    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await updateUserProfile(payload);
      if (response && response.success) {
        setSuccessMessage('프로필이 성공적으로 업데이트되었습니다!');
        if (response.data) {
            setInitialUserInfo(response); // 기존 사용자 정보 업데이트
            // 서버로부터 받은 최신 정보로 폼 상태도 업데이트
            setHeight(response.data.height?.toString() || '');
            setWeight(response.data.weight?.toString() || '');
            setSelectedUserType(response.data.userType || '');
        }
        // 선택적으로 이전 페이지로 리디렉션하거나, 메시지를 몇 초간 보여준 후 자동으로 닫기 등
        // setTimeout(() => router.back(), 2000);
      } else {
        setError(response.error?.message || '프로필 업데이트에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 업데이트 중 오류 발생');
    }
    setSaving(false);
  };
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">정보를 불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white p-4 shadow-sm">
        <div className="flex items-center max-w-md mx-auto">
          <button onClick={() => router.back()} className="flex items-center">
            <BackArrowIcon size={24} weight="bold" className="text-gray-700 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">프로필 수정</h1>
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="ml-auto p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FloppyDisk size={24} weight={saving ? "duotone" : "bold"} className={`text-violet-600 ${saving ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 pb-20 max-w-md mx-auto w-full">
        {error && (
          <div className="bg-red-100 border absolute top-0 left-0 right-0 z-20 border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <strong className="font-bold">오류: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border absolute inset-x-50 z-10 border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <strong className="font-bold">성공: </strong>
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-[#363636] mb-3">키 (cm)</label>
            <input 
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="예: 175"
              className="mt-1 block w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-[#363636] mb-3">몸무게 (kg)</label>
            <input 
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="예: 68.5"
              className="mt-1 block w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-[#363636] mb-3">나의 유형</label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <TypeCard
                type="다이어트"
                title="다이어트"
                description="체중 감량 또는 유지를 위한 식단 관리가 필요해요"
                icon={<Scales size={48} weight="fill" />}
                isSelected={selectedUserType === '다이어트'}
                onClick={() => setSelectedUserType('다이어트')}
              />

              <TypeCard
                type="근성장"
                title="근력 운동"
                description="근육 성장이나 운동 능력 향상을 위한 식단을 원해요"
                icon={<Barbell size={48} weight="fill" />}
                isSelected={selectedUserType === '근성장'}
                onClick={() => setSelectedUserType('근성장')}
              />

              <TypeCard
                type="당뇨병"
                title="당뇨 관리"
                description="혈당 조절을 위한 맞춤 영양 정보가 중요해요"
                icon={<Heartbeat size={48} weight="fill" />}
                isSelected={selectedUserType === '당뇨병'}
                onClick={() => setSelectedUserType('당뇨병')}
              />

              <TypeCard
                type="신장질환"
                title="신장 질환 관리"
                description="특정 영양소(나트륨, 칼륨 등) 조절이 필요해요"
                icon={<FirstAidKit size={48} weight="fill" />}
                isSelected={selectedUserType === '신장질환'}
                onClick={() => setSelectedUserType('신장질환')}
              />
            </div>
          </div>
        </div>
      </main>
      <BottomNavBar />
    </div>
  );
} 