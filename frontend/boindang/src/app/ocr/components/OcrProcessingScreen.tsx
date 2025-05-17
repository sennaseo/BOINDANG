"use client";

import React, { useState, useEffect } from 'react';
import { Lightbulb, X, HandPointing } from '@phosphor-icons/react';
import HandShakeDang from '@/components/3D/handShakeDang';
import ConfirmModal from '@/components/common/ConfirmModal';

// interface OcrProcessingScreenProps {
//   // 필요하다면 외부에서 제어해야 할 props 추가
// }

const tips = [
  "물을 하루 8잔 마시면 신진대사에 도움이 돼요!",
  "하루 30분 이상 햇볕을 쬐면 비타민 D 합성에 좋아요.",
  "견과류는 두뇌 건강에 좋은 불포화지방산이 풍부해요.",
  "규칙적인 수면은 면역력 강화에 중요해요.",
  "스트레칭은 혈액순환 개선과 근육 이완에 효과적이랍니다."
];

export default function OcrProcessingScreen(/*{}: OcrProcessingScreenProps*/) {
  const [currentTip, setCurrentTip] = useState<string>("");
  const [showTipBubble, setShowTipBubble] = useState<boolean>(false);
  const [isDangClicked, setIsDangClicked] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [hasCharacterBeenClicked, setHasCharacterBeenClicked] = useState<boolean>(false);

  const handleCharacterClickInternal = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[randomIndex]);
    setShowTipBubble(true);
    if (!hasCharacterBeenClicked) {
      setHasCharacterBeenClicked(true);
    }
  };

  useEffect(() => {
    setProgress(0);
    const totalDuration = 20000;
    const updatesPerInterval = 1;
    const intervalTime = totalDuration / (100 / updatesPerInterval);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev + updatesPerInterval >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + updatesPerInterval;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 p-8">
      <div
        className={`relative mb-4 h-64 w-full transition-transform duration-200 ease-in-out transform -translate-y-8 ${isDangClicked ? 'scale-95' : 'scale-100'}`}
        onMouseDown={() => setIsDangClicked(true)}
        onMouseUp={() => {
          setIsDangClicked(false);
          handleCharacterClickInternal();
        }}
        onMouseLeave={() => {
          if (isDangClicked) {
            setIsDangClicked(false);
          }
        }}
        onTouchStart={() => {
          setIsDangClicked(true);
        }}
        onTouchEnd={() => {
          setIsDangClicked(false);
          handleCharacterClickInternal();
        }}
        onTouchCancel={() => {
          setIsDangClicked(false);
        }}
      >
        {!hasCharacterBeenClicked && (
          <div className="absolute -bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center pointer-events-none animate-gentle-float">
            <HandPointing size={28} className="text-[var(--color-maincolor)] drop-shadow-lg" weight="fill" />
            <p className="mt-1 rounded-md bg-black/60 px-2.5 py-1 text-sm font-semibold text-white shadow-md">
              터치해보세요!
            </p>
          </div>
        )}
        <HandShakeDang />
        {showTipBubble && currentTip && (
          <div
            className="absolute left-1/2 top-0 z-50 mt-[-20px] w-full max-w-xs -translate-x-1/2 transform rounded-lg bg-white p-3 text-center text-sm text-gray-800 shadow-xl"
            onClick={(e) => { e.stopPropagation(); setShowTipBubble(false); }}
          >
            <div className="flex items-start">
              <Lightbulb size={28} className="mr-2 flex-shrink-0 text-yellow-500" />
              <p className="text-left">{currentTip}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTipBubble(false); }}
              className="absolute -right-2 -top-2 rounded-full bg-gray-200 p-0.5 text-gray-600 hover:bg-gray-300"
              aria-label="팁 닫기"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      <div className="my-6 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-[var(--color-maincolor)] to-[#A779FF] transition-all duration-200 ease-linear ${progress === 100 ? 'animate-pulse-wait' : ''}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-4 text-center text-xl font-semibold text-white">
        성분 분석 리포트를 준비중이에요
      </p>
      <p className="mt-2 text-center text-sm text-gray-300">
        평균 분석 시간은 20초 내외에요
      </p>
      <div className="relative mt-12 flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              setIsConfirmModalOpen(true);
            }}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-md bg-[var(--color-maincolor)]/20 border border-[var(--color-maincolor)]/50 active:bg-[var(--color-maincolor)]/30 transition-colors duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-maincolor)]"
          >
            홈에서 기다리기
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          console.log('홈으로 이동 처리 + 알림 설정 로직 필요');
          setIsConfirmModalOpen(false);
        }}
        title=""
        message="리포트가 준비되면 알려드릴게요!"
        confirmText="홈으로 가기"
        cancelText="취소"
      />
    </div>
  );
} 