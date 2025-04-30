'use client';

import React, { useState } from 'react';
// Import BottomNavBar (adjust path if needed)
import BottomNavBar from '@/components/navigation/BottomNavBar';
// Import icons
import { ArrowLeft, XCircle } from '@phosphor-icons/react';

// 임시 데이터
const topIngredients = [
  { rank: 1, name: '말티톨', count: 237 },
  { rank: 2, name: '말토덱스트린', count: 156 },
  { rank: 3, name: '알룰로스', count: 98 },
];

const recommendedIngredients = [
  { emoji: '🧊', name: '말티톨' },
  { emoji: '🧪', name: '말토덱스트린' },
  { emoji: '💧', name: '액상과당' },
  { emoji: '🍃', name: '알룰로스' },
  { emoji: '🌿', name: '스테비아' },
  { emoji: '🧊', name: '에리스리톨' }, // 에리스리톨 이모지가 명확하지 않아 🧊 사용
  { emoji: '💪', name: '단백질' },
  { emoji: '🌾', name: '식이섬유' },
  { emoji: '🧂', name: '나트륨' },
];

const categoryIngredients = [
  { name: '단백질' },
  { name: '당류' },
  { name: '감미료' },
  { name: '식이섬유' },
  { name: '지방' },
  { name: '식품 첨가물' },
  { name: '비타민' },
  { name: '미네랄' },
];

// SVG 아이콘 컴포넌트 (임시)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const DropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500 mx-auto mb-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.875 14.25l1.406-1.406 M10.125 12l1.406-1.406 M5.25 16.5l1.406-1.406 M12 14.25l-1.406 1.406 M14.25 12l-1.406 1.406 M16.5 16.5l-1.406-1.406 M18.75 14.25l-1.406 1.406 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
  </svg>
);

export default function IngredientsPage() {
  // State for search mode and search term
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleGoBack = () => {
    setIsSearching(false);
    setSearchTerm(''); // Optionally clear search term on going back
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto shadow-sm pb-[70px]">
        {/* 상단 영역: flex 제거, isSearching 상태 따라 클래스 동적 적용 */}
        <div className={`bg-white p-4 ${isSearching ? 'flex items-center gap-2' : ''}`}>
          {/* 뒤로가기 버튼 (검색 중일 때) */}
          {isSearching && (
            <button onClick={handleGoBack} className="p-1 text-gray-600 hover:text-gray-800">
              <ArrowLeft size={24} />
            </button>
          )}

          {/* 헤더 제목 (검색 중이 아닐 때): mb-4 추가 */}
          {!isSearching && (
            <h1 className="text-xl font-bold mb-4">영양 성분 백과</h1>
          )}

          {/* 검색창 컨테이너: isSearching 상태 따라 클래스 동적 적용 */}
          <div className={`relative ${isSearching ? 'flex-grow' : 'mb-2'}`}>
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isSearching ? 'hidden' : ''}`}> {/* 검색중일때 돋보기 숨김 */}
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="어떤 성분이 궁금하세요?"
              value={searchTerm}
              onFocus={handleSearchFocus}
              onChange={handleSearchChange}
              className={`w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${isSearching ? 'pl-3 pr-10 py-2' : 'pl-10 pr-4 py-2'}`} // Padding adjustment
            />
            {/* 지우기 버튼 (검색 중이고 검색어가 있을 때) */}
            {isSearching && searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} weight="fill" />
              </button>
            )}
          </div>
        </div>

        {/* 구분선 및 하단 콘텐츠 영역: 검색 상태에 따라 변경 */}
        {!isSearching ? (
          <>
            <hr className="border-gray-200" />
            <div className="bg-gray-50 p-4">
              {/* 실시간 영양 성분 Top 3 */}
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3">실시간 영양 성분 Top 3 🔥</h2>
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                  {topIngredients.map((item, index) => (
                    <div
                      key={item.rank}
                      className={`flex items-center justify-between p-3 ${index < topIngredients.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full">
                          {item.rank}
                        </span>
                        <span className="text-gray-800">{item.name}</span>
                      </div>
                      <span className="text-gray-600 font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 추천 영양 성분 */}
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3">추천 영양 성분 🙌</h2>
                <div className="grid grid-cols-3 gap-3">
                  {recommendedIngredients.map((item) => (
                    <div key={item.name} className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col items-center justify-center aspect-square">
                      <span className="text-3xl mb-2">{item.emoji}</span>
                      <span className="text-sm text-gray-700 text-center">{item.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 카테고리별 성분 사전 */}
              <section>
                <h2 className="text-lg font-semibold mb-3">카테고리별 성분 사전 📚</h2>
                <div className="grid grid-cols-4 gap-3">
                  {categoryIngredients.map((item) => (
                    <div key={item.name} className="bg-white border border-gray-100 rounded-lg shadow-sm p-3 flex flex-col items-center justify-center aspect-square">
                      <DropIcon />
                      <span className="text-xs text-gray-700 text-center whitespace-nowrap">{item.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          // 검색 중일 때 표시될 내용 (현재는 비워둠)
          <div className="p-4 h-[calc(100vh-142px)]"> {/* Adjust height as needed, considering header and navbar */}
            {/* 검색 결과가 여기에 표시됩니다. */}
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
        <BottomNavBar />
      </div>
    </div>
  );
}