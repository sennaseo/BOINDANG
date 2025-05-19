'use client';

import { useState, useEffect, useRef } from 'react';
import { CameraPlus, CaretRight, SealPercent, CheckCircle } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { usePreventSwipeBack } from '@/hooks/usePreventSwipeBack';
import { fetchQuizStatistics } from '@/api/more/quiz';
import { ApiResponse, QuizStatistics } from '@/types/api/more/quiz';
import { useRouter } from 'next/navigation';
import { getReportHistory } from '@/api/report';
import { ReportHistory } from '@/types/api/report';
import { ApiError } from '@/types/api';

// 클라이언트 사이드에서만 로드하기 위해 dynamic import 사용
const DangDangi = dynamic(() => import('@/components/3D/DangDangi'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-maincolor animate-pulse font-medium">로딩 중...</p>
    </div>
  ),
});

export default function Home() {
  const router = useRouter();
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [quizStats, setQuizStats] = useState<QuizStatistics | null>(null);
  const [loadingQuizStats, setLoadingQuizStats] = useState(true);
  const [historyItems, setHistoryItems] = useState<ReportHistory[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);


  usePreventSwipeBack(mainContainerRef, { edgeThreshold: 30 });

  useEffect(() => {
    const getQuizStats = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadingQuizStats(true);
        const stats = await fetchQuizStatistics();
        const axiosResponse = await getReportHistory();
        setQuizStats(stats);
        setHistoryItems(axiosResponse.data.data);
      } catch (error) {
        console.error("퀴즈 통계 및 분석 내역 로딩 실패:", error);
        setError(error as ApiError);
        setQuizStats(null);
        setHistoryItems(null);
      } finally {
        setLoading(false);
        setLoadingQuizStats(false);
      }
    };
    getQuizStats();
  }, []);

  const numberofocr = historyItems?.length ?? 0;

  const renderQuizMission = () => {
    if (loadingQuizStats || loading) {
      return (
        <div className="bg-maincolor rounded-xl shadow-md p-4 animate-pulse">
          <div className="flex items-center">
            <div className="mr-3 text-white">
              <SealPercent size={28} weight="fill" />
            </div>
            <div className="flex-1 text-white">
              <h3 className="font-bold h-5 bg-white/30 rounded w-3/4 mb-1"></h3>
              <p className="text-sm opacity-90 h-4 bg-white/20 rounded w-1/2"></p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500 rounded-xl shadow-md p-4">
          <p className="text-white">오류가 발생했습니다: {error.message}</p>
        </div>
      );
    }

    if (quizStats && quizStats.totalSolved < 30) {
      return (
        <div className="bg-maincolor rounded-xl shadow-md p-4">
          <div className="flex items-center">
            <div className="mr-3 text-white">
              <SealPercent size={28} weight="fill" />
            </div>
            <div className="flex-1 text-white">
              <h3 className="font-bold">오늘의 퀴즈 미션</h3>
              <p className="text-sm opacity-90">건강 퀴즈를 풀고 보상을 받아보세요!</p>
            </div>
            <button onClick={() => router.push('/quiz')} className="bg-white text-maincolor px-3 py-1.5 rounded-lg font-bold text-sm flex items-center cursor-pointer hover:bg-gray-100 transition-colors">
              문제풀기
              <CaretRight size={16} weight="bold" className="ml-1" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-green-500 rounded-xl shadow-md p-4">
        <div className="flex items-center">
          <div className="mr-3 text-white">
            <CheckCircle size={28} weight="fill" />
          </div>
          <div className="flex-1 text-white">
            <h3 className="font-bold">퀴즈 완료!</h3>
            <p className="text-sm opacity-90">오늘의 건강 퀴즈를 모두 푸셨습니다!</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={mainContainerRef} className="flex flex-col min-h-screen bg-[#F8F8F8] relative">
      {/* 상단 로고/설정 */}
      <header className="flex justify-between items-center pt-6 px-5 absolute top-0 left-0 right-0 z-10">
        <div className="relative">
          <Image src="/보인당black.png" alt="보인당 로고" width={126} height={40} />
        </div>
      </header>

      {/* 당당이 클릭 유도 문구 */}
      <div className="absolute top-30 left-0 right-0 flex justify-center z-10">
        <p className="bg-white/80 backdrop-blur-sm text-sm text-maincolor font-semibold px-4 py-2 rounded-full shadow-md animate-bounce">
          당당이를 터치해보세요! ��
        </p>
      </div>

      <main className="absolute inset-0 flex flex-col">
        {/* 중앙(애니메이션/그림 자리) */}
        {/* 당당이 컴포넌트 - 화면 전체 차지 */}
        <div className="w-full h-full">
          <DangDangi />
        </div>
      </main>


      {/* 하단 분석 버튼 영역 */}
      <div className="absolute bottom-25 left-0 right-0 px-5 z-10">
        <div className="space-y-3 mb-5">
          {/* 퀴즈 미션 알림 */}
          {renderQuizMission()}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 flex flex-col items-center justify-center">
            <div className="text-sm font-bold text-gray-500 mb-1">지금까지 분석한 식품</div>
            <div className="text-2xl font-extrabold text-maincolor">{numberofocr}</div>
            <div className="mt-1 text-xs text-gray-500">대단해요!</div>
          </div>
          <button onClick={() => router.push('/ocr/camera')} className="flex flex-col items-center justify-center gap-2 bg-maincolor text-white rounded-xl p-4 font-bold text-lg shadow-md hover:bg-maincolor/90 transition-shadow cursor-pointer">
            <CameraPlus size={26} weight="bold" />
            <div>식품 분석</div>
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="mt-auto">
        <BottomNavBar />
      </div>
    </div>
  );
}
