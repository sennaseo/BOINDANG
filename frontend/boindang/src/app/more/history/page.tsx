'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CaretLeft, Info } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';

// 임시 데이터 타입 (실제 API 응답에 맞춰 수정 필요)
interface AnalysisHistoryItem {
  id: string;
  productName: string;
  analysisDate: string; // 예: '2023-10-27'
  imageUrl?: string; // 제품 이미지 URL (옵션)
  // 기타 필요한 정보 (예: 간략한 분석 결과, GI 지수 등)
}

// 임시 API 함수 (실제 API 연동 시 대체 필요)
const getAnalysisHistory = async (): Promise<AnalysisHistoryItem[]> => {
  // 실제로는 여기서 API를 호출합니다.
  // 지금은 빈 배열 또는 더미 데이터를 반환합니다.
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연 시뮬레이션
  return [
    // 더미 데이터 예시 (주석 처리)
    /*
    {
      id: '1',
      productName: '맛있는 사과주스',
      analysisDate: '2024-05-15',
      imageUrl: '/assets/dummy/apple_juice.png', // 예시 이미지 경로
    },
    {
      id: '2',
      productName: '건강한 현미밥',
      analysisDate: '2024-05-10',
      imageUrl: '/assets/dummy/brown_rice.png',
    },
    {
      id: '3',
      productName: '단백질 가득 닭가슴살',
      analysisDate: '2024-05-01',
      // imageUrl: undefined, // 이미지가 없는 경우
    },
    */
  ];
};

export default function AnalysisHistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnalysisHistory();
        setHistoryItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '분석 기록을 불러오는 중 오류가 발생했습니다.');
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
            <p className="text-gray-600 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} // 간단한 새로고침 기능
              className="mt-4 px-4 py-2 bg-violet-500 text-white text-sm rounded-lg hover:bg-violet-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && historyItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Image src="/assets/character/boin_empty.png" alt="기록 없음" width={120} height={120} className="opacity-70 mb-6"/>
            <p className="text-xl font-semibold text-gray-700 mb-2">아직 분석한 기록이 없어요.</p>
            <p className="text-gray-500 text-sm mb-6">카메라로 식품을 촬영하고 분석해보세요!</p>
            <Link href="/ocr/camera" 
              className="px-6 py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg"
            >
              촬영하러 가기
            </Link>
          </div>
        )}

        {!loading && !error && historyItems.length > 0 && (
          <div className="space-y-3">
            {historyItems.map((item) => (
              <Link href={`/report/${item.id}`} key={item.id} className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-4">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.productName} 
                      width={64} // 16 * 4
                      height={64} // 16 * 4
                      className="rounded-md object-cover w-16 h-16 bg-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <Info size={24} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 truncate" title={item.productName}>{item.productName}</h3>
                    <p className="text-xs text-gray-500">분석일: {item.analysisDate}</p>
                    {/* 추가 정보 (예: GI 지수) 표시 가능 */}
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
