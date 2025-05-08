'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from '@phosphor-icons/react';

interface ExperienceDetail {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  maxParticipants: number;
  currentParticipants: number;
  isApplied: boolean;
  openDateTime: string;
  company: string;
  category: string;
  tags: string[];
  details: string[];
}

const mockExperience: ExperienceDetail = {
  id: 2,
  title: "코카콜라 제로 190ml",
  description: "탄산음료",
  imageUrl: "/images/coke-zero.jpg",
  maxParticipants: 100,
  currentParticipants: 0,
  isApplied: false,
  openDateTime: "4/25 06:23",
  company: "코카콜라",
  category: "음료",
  tags: ["무설탕", "제로칼로리", "탄산"],
  details: [
    "1인 1개 선착 가능",
    "신청 후 취소 불가",
    "제품 후기 작성 필수",
    "정해진 기간 내 리뷰 미작성 시 패널티"
  ]
};

export default function ExperienceDetailPage() {
  const router = useRouter();
  
  // 실제 구현 시 API로 데이터 fetch 필요
  const experience = mockExperience;

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
          alt={experience.title}
          fill
          className="object-contain bg-white"
        />
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* 상품 정보 */}
        <div className="px-5 py-6">
          <div className="text-sm text-gray-500 mb-2">{experience.category}</div>
          <h1 className="text-xl font-semibold mb-2">{experience.title}</h1>
          <p className="text-gray-600 mb-4">{experience.description}</p>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {experience.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* 체험단 정보 */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-[#6C2FF2] font-semibold">
                선착순 {experience.maxParticipants}명
              </span>
              <span className="text-gray-400 text-sm">
                ({experience.currentParticipants}명 신청완료)
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {experience.openDateTime} 오픈 예정
            </div>
          </div>

          {/* 안내사항 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h2 className="font-semibold mb-3">꼭 확인해주세요!</h2>
            <ul className="space-y-2">
              {experience.details.map((detail, index) => (
                <li key={index} className="text-sm text-gray-600">• {detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="sticky bottom-0 left-0 right-0 w-full">
        {experience.isApplied ? (
          <button
            className="w-full bg-gray-300 text-white py-3 rounded-none text-sm font-medium border-t"
          >
            신청이 완료되었습니다
          </button>
        ) : (
          <button
            className="w-full bg-[#6C2FF2] text-white py-3 rounded-none text-sm font-medium border-t"
          >
            신청하기
          </button>
        )}
      </div>
    </div>
  );
} 