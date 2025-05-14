'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const handImg = '/assets/sugarcube/sugar_hand.png';
const faceImg = '/assets/sugarcube/sugar_face.png';

// 반지름(px) - +버튼의 반지름과 맞추세요 (w-14 h-14 => 56px, 반지름 28px)
const RADIUS = 28;
const HAND_OFFSET = 10; // 손이 원 안쪽으로 들어오게 추가 이동(px)
const LEFT_ANGLE = (-130 * Math.PI) / 180; // 라디안 변환
const RIGHT_ANGLE = (-50 * Math.PI) / 180;

function handStyle(angle: number, show: boolean, isRight?: boolean) {
  return {
    left: '50%',
    top: '50%',
    transform: `translate(-50%, -50%) translate(${RADIUS * Math.cos(angle)}px, ${RADIUS * Math.sin(angle) + HAND_OFFSET}px)${isRight ? ' scaleX(-1)' : ''}`,
    zIndex: 50,
    opacity: show ? 1 : 0,
    transition: 'opacity 0.5s',
    position: 'absolute' as const,
    pointerEvents: 'none' as const,
  };
}

export default function SugarcubeMascot() {
  const [showHands, setShowHands] = useState(false);
  const [showFace, setShowFace] = useState(false);

  useEffect(() => {
    const handTimer = setTimeout(() => setShowHands(true), 200);
    const faceTimer = setTimeout(() => setShowFace(true), 800);
    return () => {
      clearTimeout(handTimer);
      clearTimeout(faceTimer);
    };
  }, []);

  return (
    <div
      className="absolute left-1/2 translate-x-[2px] bottom-2 pointer-events-none w-24 h-24 flex items-end justify-center"
      style={{ height: '90px' }}
    >
      {/* 왼손 */}
      <Image
        src={handImg}
        alt="왼손"
        style={handStyle(LEFT_ANGLE, showHands)}
        draggable={false}
        width={16}
        height={16}
      />
      {/* 오른손 */}
      <Image
        src={handImg}
        alt="오른손"
        style={handStyle(RIGHT_ANGLE, showHands, true)}
        draggable={false}
        width={16}
        height={16}
      />
      {/* 얼굴(몸통) */}
      <Image
        src={faceImg}
        alt="각설탕 얼굴"
        className={`absolute left-1/2 -translate-x-1/2 translate-x-[10px] bottom-10 transition-all duration-500 ${showFace ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        style={{ zIndex: 30, pointerEvents: 'none' }}
        draggable={false}
        width={80}
        height={80}
      />
    </div>
  );
} 