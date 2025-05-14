'use client';

import { CameraPlus, CaretRight, SealPercent } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 로드하기 위해 dynamic import 사용
const DangDangi = dynamic(() => import('@/components/3D/DangDangi'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p>로딩 중...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen mx-5 mt-4 bg-white">
      {/* 상단 로고/설정 */}
      <header className="flex justify-between items-center pt-6">
      <Image src="/보인당black.png" alt="보인당 로고" width={126} height={40}/>
        <button className="bg-gray-100 rounded-full p-2">
          <SealPercent size={24} weight="bold" />
        </button>
      </header>

      {/* 오늘의 미션 카드 */}
      <section className=" mt-4">
        <div className="bg-white rounded-full shadow py-4 px-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-maincolor mb-1">오늘의 미션</div>
            <div className="font-medium">보인당 퀴즈 풀어 보기</div>
          </div>
          <CaretRight size={24} weight="bold" />
        </div>
      </section>

      {/* 중앙(애니메이션/그림 자리) */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full my-4 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm">
          <DangDangi />
        </div>

        {/* 분석/퀴즈 버튼 */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className=" bg-white rounded-xl shadow py-4 px-6 text-start w-full">
              <div className="text-xs text-gray-400 mb-1">지금까지 분석한 식품</div>
              <div className="text-lg font-bold text-maincolor">20개</div>
            </div>
            <button className="w-full mt-2 px-6 py-4 bg-white text-start text-[#363636] rounded-xl shadow font-semibold">
              퀴즈 풀기
            </button>
          </div>
          <button className="flex-1 flex flex-col items-center justify-center gap-2 bg-maincolor text-white rounded-xl p-4 font-bold text-lg shadow">
            <CameraPlus size={24} weight="bold" />
            <div>식품 분석</div>
          </button>
        </div>
      </main>

      {/* 식품 종합GI 순위 */}
      <section className="mb-24">
        <div className="bg-white rounded-xl shadow p-4 mt-4">
          <div className="font-bold mb-2">식품 종합GI 순위</div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div>
              <div className="font-medium">초코초코쉐이크</div>
              <div className="text-xs text-gray-400">위험 성분: 2개</div>
            </div>
            <div className="ml-auto bg-gray-200 rounded-xl text-center p-2">
              <div className="text-xs font-light text-gray-400">종합 GI</div>
              <div className="text-lg text-morered font-bold">20</div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  );
}
