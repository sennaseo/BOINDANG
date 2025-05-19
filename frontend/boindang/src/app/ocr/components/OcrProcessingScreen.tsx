"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HandPointing, Lightbulb, X, CaretRight } from '@phosphor-icons/react'; // CaretRight 아이콘 추가
import HandShakeDang from '@/components/3D/handShakeDang';
import ConfirmModal from '@/components/common/ConfirmModal';

// KnowledgeCard 컴포넌트 ("제안 1: 활기찬 당당이의 말풍선")
interface KnowledgeCardProps {
  tip: string;
  onClose: () => void;
  onNextTip: () => void;
}

function KnowledgeCard({ tip, onClose, onNextTip }: KnowledgeCardProps) {
  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-auto max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center">
      <div className="relative w-72 rounded-xl bg-white p-4 text-gray-800 shadow-xl">
        <div className="flex flex-col mb-3">
          <div className="flex items-center mb-2">
            <Lightbulb size={22} weight="fill" className="mr-2 flex-shrink-0 text-yellow-400" />
            <h3 className="text-sm font-semibold text-gray-700">당당이의 상식 꿀팁!</h3>
          </div>
          <p className="text-sm leading-relaxed break-keep text-gray-700">{tip}</p>
        </div>

        {/* 하단 버튼 영역 - 구분선 제거 */}
        <div className="flex justify-between items-center mt-3"> {/* pt-2 및 border-t 제거, mt-4를 mt-3으로 조정 */}
          {/* 닫기 버튼 - 왼쪽 칩 스타일 */}
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-4 py-2 shadow-sm hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-opacity-75"
            aria-label="닫기"
          >
            <X size={14} weight="bold" />
            <span>닫기</span>
          </button>

          {/* 다음 팁 버튼 - 오른쪽 칩 스타일 */}
          <button
            onClick={onNextTip}
            className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-maincolor)] text-white text-xs font-medium px-4 py-2 shadow-md hover:bg-[var(--color-maincolor-100)] active:bg-opacity-90 transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maincolor)] focus-visible:ring-opacity-75"
            aria-label="다음 팁"
          >
            <span>다음</span>
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </div>
      {/* 말풍선 꼬리 */}
      <div className="mt-[-1px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white shadow-md" />
    </div>
  );
}

const knowledgeTips = [
  "물을 하루 8잔 마시면 신진대사에 도움이 돼요!",
  "하루 30분 이상 햇볕을 쬐면 비타민 D 합성에 좋아요.",
  "견과류는 두뇌 건강에 좋은 불포화지방산이 풍부해요.",
  "규칙적인 수면은 면역력 강화에 중요해요.",
  "스트레칭은 혈액순환 개선과 근육 이완에 효과적이랍니다."
];

export default function OcrProcessingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [shouldShowTouchText, setShouldShowTouchText] = useState<boolean>(false);
  const [isKnowledgeCardVisible, setIsKnowledgeCardVisible] = useState<boolean>(false);
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [askDangToRunForward, setAskDangToRunForward] = useState<boolean>(false);

  useEffect(() => {
    setProgress(0);
    const totalDuration = 20000;
    const updatesPerInterval = 1;
    const intervalTime = totalDuration / (100 / updatesPerInterval);
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + updatesPerInterval;
        if (newProgress >= 100) {
          clearInterval(timer);
          console.log("OCR Progress 100%.");
          const navigatedHome = localStorage.getItem('ocrUserNavigatedHome');
          if (navigatedHome === 'true') {
            console.log("User chose to wait at home. Result will be available there via toast.");
          } else {
            console.log("User stayed on processing screen. API call should determine navigation to result.");
          }
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, []);

  const handleShouldShowKnowledgeCard = useCallback(() => {
    console.log('OcrProcessingScreen: Received request to show knowledge card.');
    const randomIndex = Math.floor(Math.random() * knowledgeTips.length);
    setCurrentTipIndex(randomIndex);
    setIsKnowledgeCardVisible(true);
  }, []);

  const handleKnowledgeCardClose = useCallback(() => {
    console.log('OcrProcessingScreen: Knowledge card closed. Asking Dang to run forward.');
    setIsKnowledgeCardVisible(false);
    setAskDangToRunForward(true);
  }, []);

  const handleNextTip = useCallback(() => {
    setCurrentTipIndex(prevIndex => (prevIndex + 1) % knowledgeTips.length);
  }, []);

  const handleDangRunForwardFinished = useCallback(() => {
    console.log('OcrProcessingScreen: Dang finished running forward. Resetting command.');
    setAskDangToRunForward(false);
  }, []);

  const handleConfirmAndGoHome = () => {
    const processingMessage = '성분 분석 리포트를 준비 중입니다...';
    localStorage.setItem('ocrAnalysisState', 'processing');
    localStorage.setItem('ocrAnalysisMessage', processingMessage);
    localStorage.setItem('ocrRequestTimestamp', Date.now().toString());
    localStorage.setItem('ocrUserNavigatedHome', 'true');

    // BroadcastChannel로 processing 상태 즉시 알림
    try {
      const channel = new BroadcastChannel('ocr_status_channel');
      channel.postMessage({
        status: 'processing',
        message: processingMessage
      });
      channel.close();
      console.log("[OcrProcessingScreen] Posted 'processing' status via BroadcastChannel.");
    } catch (error) {
      console.error("[OcrProcessingScreen] Error posting to BroadcastChannel:", error);
    }

    router.push('/');
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 p-8">
      {isKnowledgeCardVisible && (
        <KnowledgeCard
          tip={knowledgeTips[currentTipIndex]}
          onClose={handleKnowledgeCardClose}
          onNextTip={handleNextTip}
        />
      )}

      <div
        className={`relative mb-4 h-64 w-full transition-transform duration-200 ease-in-out transform -translate-y-8 scale-100`}
      >
        <HandShakeDang
          onShouldShowTouchPrompt={setShouldShowTouchText}
          onShouldShowKnowledgeCard={handleShouldShowKnowledgeCard}
          runForwardCommand={askDangToRunForward}
          onRunForwardAnimationFinished={handleDangRunForwardFinished}
        />
      </div>

      {/* "터치해보세요!" UI */}
      <div
        className={`flex flex-col items-center animate-gentle-float pointer-events-none mb-1 ${shouldShowTouchText ? '' : 'invisible'}`}
      >
        <HandPointing size={28} className="text-[var(--color-maincolor)] drop-shadow-lg" weight="fill" />
        <p className="mt-1 rounded-md bg-black/60 px-2.5 py-1 text-sm font-semibold text-white shadow-md whitespace-nowrap">
          터치해보세요!
        </p>
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
            onClick={() => setIsConfirmModalOpen(true)}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-md bg-[var(--color-maincolor)]/20 border border-[var(--color-maincolor)]/50 active:bg-[var(--color-maincolor)]/30 transition-colors duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-maincolor)]"
          >
            홈에서 기다리기
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAndGoHome}
        title="홈으로 이동"
        message="리포트가 준비되면 알려드릴게요! 홈으로 이동하시겠습니까?"
        confirmText="홈으로 가기"
        cancelText="계속 기다리기"
      />
    </div>
  );
} 