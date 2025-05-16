'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import BottomNavBar from "@/components/navigation/BottomNavBar";

// 목업 데이터
const MOCK_EXPERIENCES = [
  {
    id: 1,
    title: '친환경 음료 신제품 체험단',
    company: '그린푸드',
    deadline: '2023-12-15',
    status: '진행중',
    image: '/assets/experience/product1.png',
  },
  {
    id: 2,
    title: '유기농 곡물 스낵 체험단',
    company: '자연식품',
    deadline: '2023-12-10',
    status: '당첨',
    image: '/assets/experience/product2.png',
  },
  {
    id: 3,
    title: '비건 초콜릿 체험단',
    company: '허브월드',
    deadline: '2023-12-05',
    status: '마감',
    image: '/assets/experience/product3.png',
  },
  {
    id: 4,
    title: '저지방 유제품 체험단',
    company: '헬시푸드',
    deadline: '2023-12-20',
    status: '진행중',
    image: '/assets/experience/product4.png',
  },
];

export default function ExperiencePage() {
  const [filter, setFilter] = useState('전체');
  
  // 필터링된 체험단 목록
  const filteredExperiences = filter === '전체' 
    ? MOCK_EXPERIENCES 
    : MOCK_EXPERIENCES.filter(exp => exp.status === filter);

  return (
    <div className="flex flex-col mx-5 pt-5 pb-20 min-h-screen">
      {/* 헤더 */}
      <div className="flex flex-row items-center mb-6">
        <Link href="/more">
          <ArrowLeft size={24} weight="bold" fill="#363636" className="mr-3" />
        </Link>
        <h1 className="text-xl font-bold text-[#363636]">체험단</h1>
      </div>
      
      {/* 필터 버튼 */}
      <div className="flex space-x-2 mb-5">
        {['전체', '진행중', '당첨', '마감'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === status
                ? 'bg-moreyellow text-white'
                : 'bg-gray-100 text-[#363636]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      
      {/* 체험단 목록 */}
      <div className="space-y-4">
        {filteredExperiences.length > 0 ? (
          filteredExperiences.map((exp) => (
            <div 
              key={exp.id}
              className="border border-gray-200 rounded-xl p-4 flex items-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4 relative overflow-hidden">
                {/* 실제 이미지가 없으므로 임시 회색 상자로 대체 */}
                <div className="w-full h-full bg-gray-200"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#363636]">{exp.title}</h3>
                <p className="text-gray-500 text-sm">{exp.company}</p>
                <p className="text-sm">마감일: {exp.deadline}</p>
              </div>
              <div className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${exp.status === '진행중' ? 'bg-blue-100 text-blue-800' : 
                  exp.status === '당첨' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'}
              `}>
                {exp.status}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            해당 조건의 체험단이 없습니다.
          </div>
        )}
      </div>
      
      <BottomNavBar />
    </div>
  );
}
