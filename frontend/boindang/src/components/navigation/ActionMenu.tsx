'use client';

import { Camera, NewspaperClipping, Trophy, BookmarkSimple, X, ChatCircleDots } from "@phosphor-icons/react";
import Link from "next/link"; // Link 컴포넌트 사용을 위해 import

interface ActionMenuProps {
  onClose: () => void; // 메뉴를 닫는 함수
}

export default function ActionMenu({ onClose }: ActionMenuProps) {
  return (
    // 1. 배경 처리 수정: bg-black bg-opacity-30 -> bg-gray-900/75 (어둡게 비치도록)
    <div
      className="fixed inset-0 bg-gray-900/75 z-50 flex items-end justify-center" // z-index 유지
      onClick={onClose} // 오버레이 클릭 시 메뉴 닫기
    >
      {/* 메뉴 컨테이너: 상단 테두리 추가 */}
      {/* 3. 검은 선 문제 해결 시도: z-[51], overflow-hidden 추가 */}
      <div
        className="bg-white w-full md:w-[440px] md:mx-auto rounded-t-2xl p-6 pt-8 flex flex-col items-center relative z-[51] overflow-hidden border-t border-gray-200"
        onClick={(e) => e.stopPropagation()} // 메뉴 내부 클릭 시 이벤트 전파 방지
      >
        {/* 성분 분석하기 버튼 */}
        {/* TODO: 성분 분석 페이지 또는 기능 경로로 변경 */}
        <Link
          href="/ocr/camera"
          className="w-full border border-[#6C2FF2] rounded-xl p-4 flex items-center justify-center gap-2 mb-6 text-[#6C2FF2] font-medium hover:bg-[#F5F1FF] transition-colors"
          onClick={onClose} // 링크 클릭 시 메뉴 닫기
        >
          <Camera size={20} weight="bold" />
          <span>성분 분석하기</span>
        </Link>

        {/* 카드 뉴스 / 영양 퀴즈 / 체험단 / 커뮤니티: 3열 그리드, gap-y-6 추가 */}
        <div className="grid grid-cols-3 gap-y-6 w-full mb-8">
          {/* 카드 뉴스 */}
          {/* TODO: 카드 뉴스 페이지 경로로 변경 */}
          <Link href="/news" className="flex flex-col items-center gap-1 text-gray-700 text-sm" onClick={onClose}>
            <NewspaperClipping size={28} weight="fill" />
            <span>카드 뉴스</span>
          </Link>

          {/* 영양 퀴즈 */}
          {/* TODO: 영양 퀴즈 페이지 경로로 변경 */}
          <Link href="/quiz" className="flex flex-col items-center gap-1 text-gray-700 text-sm" onClick={onClose}>
            <Trophy size={28} weight="fill" />
            <span>영양 퀴즈</span>
          </Link>

          {/* 체험단 */}
          {/* TODO: 체험단 페이지 경로로 변경 */}
          <Link href="/experience" className="flex flex-col items-center gap-1 text-gray-700 text-sm" onClick={onClose}>
            <BookmarkSimple size={28} weight="fill" />
            <span>체험단</span>
          </Link>

          {/* 커뮤니티 - 새로운 메뉴 항목 */}
          {/* TODO: 커뮤니티 페이지 경로로 변경 */}
          <Link href="/community" className="flex flex-col items-center gap-1 text-gray-700 text-sm" onClick={onClose}>
            <ChatCircleDots size={28} weight="fill" />
            <span>커뮤니티</span>
          </Link>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="bg-[#6C2FF2] rounded-full w-14 h-14 flex items-center justify-center text-white shadow-md focus:outline-none"
          aria-label="메뉴 닫기"
        >
          <X size={24} weight="bold" />
        </button>
      </div>
    </div>
  );
}
