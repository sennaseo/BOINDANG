'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // next/image 사용
import BackArrowIcon from '@/components/common/BackArrowIcon';

// 임시 사용자 정보
const userInfo = {
  nickname: '파릇파릇한치커리1344',
  profileImageUrl: '/images/temp/profile_placeholder.png', // 임시 이미지 경로
  postCount: 0,
  commentCount: 0,
};

// 임시 '작성한 글 없음' 아이콘 (실제 아이콘 컴포넌트로 대체 필요)
const EmptyPlaceholder = () => (
  <div className="flex flex-col items-center justify-center text-center h-full text-gray-500 pt-16">
    {/* TODO: 적절한 아이콘으로 교체 */}
    <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <p>작성한 글이 없습니다.</p>
  </div>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center p-4 bg-[#0B0B1A]">
        <Link href="/community" className="mr-4">
          <BackArrowIcon size={24} weight="bold" />
        </Link>
        {/* Header Title can be added here if needed */}
      </header>

      {/* Profile Info */}
      <section className="p-4 flex items-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-blue-300 border-2 border-gray-600 flex-shrink-0">
          {/* 프로필 이미지 - next/image 사용 */}
          <Image
            src={userInfo.profileImageUrl}
            alt={`${userInfo.nickname} 프로필 이미지`}
            fill // 부모 요소 채우도록 설정
            style={{ objectFit: 'cover' }} // 이미지 비율 유지하며 채우기
            priority // 중요한 이미지 우선 로드
            // onError 핸들러 추가하여 이미지 로드 실패 시 대체 처리
            onError={(e) => (e.currentTarget.src = '/images/temp/default_profile.png')} // 대체 이미지 경로
          />
        </div>
        <div>
          <h1 className="text-lg font-semibold flex items-center">
            {userInfo.nickname}
            {/* TODO: 닉네임 옆 > 아이콘 추가 및 링크 */}
            <span className="ml-1 text-gray-400">{'>'}</span>
          </h1>
          <p className="text-sm text-gray-400">
            작성글 {userInfo.postCount} 작성댓글 {userInfo.commentCount}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-center font-semibold transition-colors duration-200 ease-in-out ${activeTab === 'posts' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          작성글
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex-1 py-3 text-center font-semibold transition-colors duration-200 ease-in-out ${activeTab === 'comments' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          작성댓글
        </button>
      </nav>

      {/* Content Area */}
      <main className="flex-grow p-4">
        {activeTab === 'posts' && (
          // TODO: 실제 작성글 목록 컴포넌트 렌더링
          <EmptyPlaceholder />
        )}
        {activeTab === 'comments' && (
          // TODO: 실제 작성댓글 목록 컴포넌트 렌더링
          <div className="text-center text-gray-500 pt-16">
            작성한 댓글이 없습니다.
          </div>
        )}
      </main>
    </div>
  );
} 