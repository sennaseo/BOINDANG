'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Pill, Plus, ForkKnife, DotsThreeCircle } from '@phosphor-icons/react';
import ActionMenu from './ActionMenu'; // 주석 해제 및 import

export default function BottomNavBar() {
  const pathname = usePathname();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const toggleActionMenu = () => {
    setIsActionMenuOpen(!isActionMenuOpen);
  };

  // TODO: 현재 활성 경로에 따라 아이콘/텍스트 색상 변경 로직 추가 (usePathname 사용)
  const activeColor = "#6C2FF2"; // 활성 상태 색상 예시
  const inactiveColor = "#A0AEC0"; // 비활성 상태 색상 (회색 계열)

  return (
    <>
      {/* 액션 메뉴 */}
      {isActionMenuOpen && <ActionMenu onClose={toggleActionMenu} />} {/* 조건부 렌더링 및 onClose 전달 */}

      <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-around px-4 z-40"> {/* z-index 조정 */}
        {/* 홈 */}
        <Link href="/" className="flex flex-col items-center justify-center w-1/5">
          <House size={26} weight="fill" color={pathname === '/' ? activeColor : inactiveColor} />
          <span className="text-xs mt-1" style={{ color: pathname === '/' ? activeColor : inactiveColor }}>홈</span>
        </Link>

        {/* 성분 */}
        {/* TODO: 성분 페이지 경로로 변경 */}
        <Link href="/ingredients" className="flex flex-col items-center justify-center w-1/5">
          <Pill size={26} weight="fill" color={pathname === '/ingredients' ? activeColor : inactiveColor} />
          <span className="text-xs mt-1" style={{ color: pathname === '/ingredients' ? activeColor : inactiveColor }}>성분</span>
        </Link>

        {/* 중앙 + 버튼: z-index 조정 */}
        <div className="w-1/5 flex justify-center">
          <button
            onClick={toggleActionMenu}
            className="bg-[#6C2FF2] rounded-full w-14 h-14 flex items-center justify-center text-white shadow-md transform -translate-y-3 focus:outline-none"
            aria-label="메뉴 열기"
          >
            <Plus size={28} weight="bold" />
          </button>
        </div>

        {/* 식품 */}
        {/* TODO: 식품 페이지 경로로 변경 */}
        <Link href="/foods" className="flex flex-col items-center justify-center w-1/5">
          <ForkKnife size={26} weight="fill" color={pathname === '/foods' ? activeColor : inactiveColor} />
          <span className="text-xs mt-1" style={{ color: pathname === '/foods' ? activeColor : inactiveColor }}>식품</span>
        </Link>

        {/* 더보기 */}
        {/* TODO: 더보기 페이지 경로로 변경 */}
        <Link href="/more" className="flex flex-col items-center justify-center w-1/5">
          <DotsThreeCircle size={26} weight="fill" color={pathname === '/more' ? activeColor : inactiveColor} />
          <span className="text-xs mt-1" style={{ color: pathname === '/more' ? activeColor : inactiveColor }}>더보기</span>
        </Link>
      </nav>
    </>
  );
}
