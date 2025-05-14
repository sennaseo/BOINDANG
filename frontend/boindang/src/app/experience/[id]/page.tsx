'use client';

import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft } from '@phosphor-icons/react';
import { fetchExperienceDetail } from '../../../api/experience';
import { useAuthStore } from '../../../stores/authStore';
import type { ExperienceDetail } from '../../../types/api/experience';

export default function ExperienceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = Number(params.id);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken || !campaignId) return;
    setLoading(true);
    fetchExperienceDetail(accessToken, campaignId)
      .then((res) => {
        setExperience(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('상세 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, [accessToken, campaignId]);

  if (loading) return <div>로딩 중...</div>;
  if (error || !experience) return <div>{error || '데이터 없음'}</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-screen-sm mx-auto relative">
      {/* 상품 이미지 + 상단 뒤로가기 버튼 */}
      <div className="relative w-full h-[400px]">
        <button
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="absolute top-4 left-4 z-20 bg-white rounded-full p-2 shadow-md"
        >
          <ArrowLeft size={24} className="text-text-primary" />
        </button>
        <Image
          src={experience.imageUrl}
          alt={experience.name}
          fill
          className="object-contain bg-white"
        />
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-5 py-6">
          <div className="text-sm text-gray-500 mb-2">{experience.mainCategory} &gt; {experience.subCategory}</div>
          <h1 className="text-xl font-semibold mb-2">{experience.name}</h1>
          <p className="text-gray-600 mb-4">{experience.content}</p>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {experience.hashtags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* 체험단 정보 */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-[#6C2FF2] font-semibold">
                선착순 {experience.capacity}명
              </span>
              <span className="text-gray-400 text-sm">
                ({experience.applicantCount}명 신청완료)
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {experience.startDate.slice(5, 10).replace('-', '/')} {experience.startDate.slice(11, 16)} 오픈 예정
            </div>
          </div>

          {/* 안내사항 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h2 className="font-semibold mb-3">꼭 확인해주세요!</h2>
            <ul className="space-y-2">
              {experience.notices.map((notice, index) => (
                <li key={index} className="text-sm text-gray-600">• {notice}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="sticky bottom-0 left-0 right-0 w-full">
        <button
          className="w-full bg-[#6C2FF2] text-white py-3 rounded-none text-sm font-medium border-t"
        >
          신청하기
        </button>
      </div>
    </div>
  );
} 
