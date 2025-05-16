'use client';

import { newsData } from '../../data/news';
import NewsCard from '../../components/news/NewsCard';
import BottomNavBar from '../../components/navigation/BottomNavBar';

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-screen-sm mx-auto">
      {/* 헤더 */}
      <div className="bg-white px-6 py-4">
        <h1 className="text-xl font-bold">건강 뉴스</h1>
        <p className="text-sm text-gray-600 mt-1">건강뉴스를 통해 오늘도 건강한 하루 되세요!</p>
      </div>

      {/* 뉴스 목록 */}
      <main className="flex-1 p-4 pb-24">
        <div className="space-y-4">
          {newsData.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  );
}
