'use client';

import { useParams, useRouter } from 'next/navigation';
import { newsData } from '../../../data/news';
import BackArrowIcon from '@/components/common/BackArrowIcon';
import BottomNavBar from '../../../components/navigation/BottomNavBar';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = Number(params.id);
  
  const news = newsData.find(n => n.id === newsId);
  
  if (!news) {
    return <div>뉴스를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-screen-sm mx-auto">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white z-10">
        <div className="relative px-6 py-4 border-b">
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-1/2 -translate-y-1/2"
          >
            <BackArrowIcon size={24} />
          </button>
          <h1 className="text-center text-lg font-semibold">건강 뉴스</h1>
        </div>
      </div>

      {/* 뉴스 내용 */}
      <main className="flex-1 px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">{news.title}</h2>
        
        <div className="space-y-8">
          {news.sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold text-[#6C2FF2]">
                {section.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-8">{news.date}</p>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  );
}
