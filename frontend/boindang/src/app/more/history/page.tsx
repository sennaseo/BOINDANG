'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CaretLeft, Info } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import { getReportHistory } from '@/api/report';
import { ReportHistory } from '@/types/api/report';
import { ApiError, ApiResponse } from '@/types/api';

// 날짜 포맷팅 함수
function formatAnalyzedAt(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default function AnalysisHistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<ApiResponse<ReportHistory[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const axiosResponse = await getReportHistory();
        console.log(axiosResponse);
        setHistoryItems(axiosResponse.data);
      } catch (err) {
        setError(err as ApiError);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-1.5 rounded-full hover:bg-gray-100">
            <CaretLeft size={24} weight="bold" className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">나의 분석 기록</h1>
          <div className="w-10">{/* 오른쪽 공간 확보용 */ }</div>
        </div>
      </header>

      {/* 내용 */}
      <main className="flex-grow p-4 pb-20 max-w-md mx-auto w-full">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500">분석 기록을 불러오는 중...</p>
            {/* 로딩 스피너 추가 가능 */}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <Info size={48} weight="bold" className="text-red-500 mb-3" />
            <p className="text-red-500 font-semibold mb-1">오류 발생</p>
            <p className="text-gray-600 text-sm">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} // 간단한 새로고침 기능
              className="mt-4 px-4 py-2 bg-violet-500 text-white text-sm rounded-lg hover:bg-violet-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && historyItems && historyItems.data && historyItems.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <p className="text-xl font-semibold text-gray-700 mb-2">아직 분석한 기록이 없어요.</p>
            <p className="text-gray-500 text-sm mb-6">카메라로 식품을 촬영하고 분석해보세요!</p>
            <Link href="/ocr/camera" 
              className="px-6 py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg"
            >
              촬영하러 가기
            </Link>
          </div>
        )}

        {!loading && !error && historyItems && historyItems.data && historyItems.data.length > 0 && (
          <div className="space-y-3">
            {historyItems.data.map((item, index) => (
              <Link href={`/report/${item.productId}`} key={`${item.productId}-${index}`} className="block bg-white py-4 px-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 truncate mb-2" title={item.productName}>{item.productName}</h3>
                    <p className="text-xs text-gray-500">분석일: {formatAnalyzedAt(item.analyzedAt)}</p>
                  </div>
                  <CaretLeft size={20} weight="bold" className="text-gray-400 transform rotate-180" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  );
}
