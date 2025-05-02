'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { X, Camera, CaretDown, CaretUp, XCircle } from '@phosphor-icons/react';

// 게시판 카테고리 목록 (글쓰기 시 선택 가능 항목)
// '전체', '체험단'은 제외하거나 필요에 따라 조정
const categories = ["식단", "운동", "고민&질문", "꿀팁", "목표 & 다짐"];
const MAX_IMAGES = 10;

export default function CommunityWritePage() {
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_LENGTH = 1000;

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  // 파일 입력 변경 핸들러
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    // 최대 10개까지만 추가
    const limit = Math.min(files.length, MAX_IMAGES - selectedImages.length);

    for (let i = 0; i < limit; i++) {
      const file = files[i];
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedImages((prev) => [...prev, ...newImages]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // 입력 필드 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index: number) => {
    // Object URL 해제
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 파일 입력 트리거 핸들러
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // 컴포넌트 언마운트 시 Object URL 해제
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 px-4 pt-8 pb-4">
      {/* Header: 레이아웃 변경 및 하단 패딩 증가 */}
      <header className="flex justify-between items-center pb-6">
        <div className="flex items-center gap-2"> {/* X와 제목 그룹화 */}
          <Link href="/community" aria-label="닫기">
            <X size={24} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold">글쓰기</h1>
        </div>
        <button
          type="button"
          className="text-[#6C2FF2] font-medium disabled:text-gray-400"
          onClick={() => console.log('Submit:', { category: selectedCategory, content, images: selectedImages })} // TODO: 실제 제출 로직
          disabled={!content.trim() || !selectedCategory}
        >
          완료
        </button>
      </header>

      {/* Form Area */}
      <div className="flex-grow flex flex-col gap-4">
        {/* 게시판 선택 (드롭다운 기능 추가) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full border border-gray-300 rounded-xl p-3 flex justify-between items-center text-left transition-colors ${selectedCategory ? 'text-gray-800' : 'text-gray-500'} hover:border-[#6C2FF2] focus:outline-none focus:ring-1 focus:ring-[#6C2FF2]`}
          >
            <span>
              {selectedCategory || '게시판 선택'} <span className="text-red-500">*</span>
            </span>
            {/* 조건부 아이콘 렌더링 */}
            {isDropdownOpen ? <CaretUp size={20} className="text-gray-500" /> : <CaretDown size={20} className="text-gray-500" />}
          </button>

          {/* 드롭다운 목록 */}
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <ul>
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 텍스트 입력: wrapper div에서 flex-grow 제거 */}
        <div className="relative"> {/* flex-grow 제거됨 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_LENGTH}
            placeholder="글을 입력해주세요."
            // min-h-[130px] -> min-h-[130px]
            className="w-full h-full min-h-[130px] resize-none p-3 focus:outline-none placeholder-gray-400"
          // 포커스 링은 유지하거나 필요에 따라 제거
          />
          <span className="absolute bottom-3 right-3 text-xs text-gray-400">
            {content.length}/{MAX_LENGTH}자
          </span>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 사진 추가하기: radius 증가 */}
        <button
          type="button"
          onClick={handleFileInputClick}
          disabled={selectedImages.length >= MAX_IMAGES}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:border-[#6C2FF2] hover:text-[#6C2FF2] transition-colors focus:outline-none focus:ring-1 focus:ring-[#6C2FF2] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera size={24} weight="light" className="mb-1" />
          {/* 카운트 표시 */}
          <span>사진 추가하기 ({selectedImages.length}/{MAX_IMAGES})</span>
        </button>

        {/* 이미지 미리보기 목록 */}
        {imagePreviews.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {imagePreviews.map((previewUrl, index) => (
              <div key={index} className="relative flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={`미리보기 ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-1 -right-1 bg-gray-700 rounded-full p-0.5 text-white hover:bg-red-500 transition-colors"
                  aria-label={`이미지 ${index + 1} 삭제`}
                >
                  <XCircle size={16} weight="fill" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Buttons 영역 제거됨 */}
      {/* 기록 선택하기 버튼 제거됨 */}

    </div>
  );
}
