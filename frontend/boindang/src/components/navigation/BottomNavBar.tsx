'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { House, Pill, Plus, ForkKnife, DotsThreeCircle } from '@phosphor-icons/react';
import ActionMenu from './ActionMenu';


const handImg = '/assets/sugarcube/sugar_hand.png';
const faceImg = '/assets/sugarcube/sugar_face.png';
const RADIUS = 32;
const HAND_OFFSET = -25;
const LEFT_ANGLE = (-120 * Math.PI) / 180;
const RIGHT_ANGLE = (-60 * Math.PI) / 180;

export default function BottomNavBar() {
  const pathname = usePathname();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [showHands, setShowHands] = useState(false);
  const [showFace, setShowFace] = useState(false);

  const toggleActionMenu = () => {
    setIsActionMenuOpen(!isActionMenuOpen);
  };

  // TODO: 현재 활성 경로에 따라 아이콘/텍스트 색상 변경 로직 추가 (usePathname 사용)
  const activeColor = "#6C2FF2"; // 활성 상태 색상 예시
  const inactiveColor = "#A0AEC0"; // 비활성 상태 색상 (회색 계열)

  useEffect(() => {
    if (pathname !== '/') return;
    setShowHands(false);
    setShowFace(false);

    const handTimer = setTimeout(() => setShowHands(true), 50);
    const faceTimer = setTimeout(() => setShowFace(true), 800);

    // 3초 후 얼굴 사라짐
    const hideFaceTimer = setTimeout(() => setShowFace(false), 3000);
    // 얼굴 애니메이션(500ms) 후 손 사라짐
    const hideHandsTimer = setTimeout(() => setShowHands(false), 3500);

    return () => {
      clearTimeout(handTimer);
      clearTimeout(faceTimer);
      clearTimeout(hideFaceTimer);
      clearTimeout(hideHandsTimer);
    };
  }, [pathname]);

  return (
    <>
      {/* 액션 메뉴 */}
      {isActionMenuOpen && <ActionMenu onClose={toggleActionMenu} />} {/* 조건부 렌더링 및 onClose 전달 */}

      <nav className="fixed bottom-0 left-0 right-0 w-full md:max-w-[440px] md:mx-auto h-[80px] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-around px-4 z-40"> {/* z-index 조정 */}
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
        <div className="w-1/5 flex justify-center relative" style={{ minHeight: '100px' }}>
          {pathname === '/' && (
            <>
              {/* 왼손 */}
              <Image
                src={handImg}
                alt="왼손"
                width={12}
                height={12}
                style={{
                  zIndex: 50,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${RADIUS * Math.cos(LEFT_ANGLE)}px, ${RADIUS * Math.sin(LEFT_ANGLE) + HAND_OFFSET}px)`,
                  opacity: showHands ? 1 : 0,
                  transition: 'opacity 0.5s',
                  pointerEvents: 'none',
                }}
                draggable={false}
                unoptimized
              />
              {/* 오른손 */}
              <Image
                src={handImg}
                alt="오른손"
                width={12}
                height={12}
                style={{
                  zIndex: 50,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${RADIUS * Math.cos(RIGHT_ANGLE)}px, ${RADIUS * Math.sin(RIGHT_ANGLE) + HAND_OFFSET}px) scaleX(-1)`,
                  opacity: showHands ? 1 : 0,
                  transition: 'opacity 0.5s',
                  pointerEvents: 'none',
                }}
                draggable={false}
                unoptimized
              />
              {/* 얼굴(몸통) */}
              <Image
                src={faceImg}
                alt="각설탕 얼굴"
                width={64}
                height={64}
                className={`absolute left-1/2 -translate-x-1/2 translate-x-[-30px] bottom-20 w-16 h-16 transition-all duration-500 ${showFace ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ zIndex: 30, pointerEvents: 'none' as React.CSSProperties['pointerEvents'] }}
                draggable={false}
                unoptimized
              />
            </>
          )}
          {/* +버튼 */}
          <button
            onClick={toggleActionMenu}
            className="bg-[#6C2FF2] rounded-full w-14 h-14 flex items-center justify-center text-white shadow-md transform -translate-y-3 focus:outline-none z-40"
            aria-label="메뉴 열기"
            style={{ position: 'relative', zIndex: 40 }}
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
