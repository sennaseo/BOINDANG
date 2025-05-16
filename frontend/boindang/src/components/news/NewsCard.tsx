import Image from 'next/image';
import Link from 'next/link';
import { News } from '../../data/news';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.id}`}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 hover:shadow-md transition-shadow">
        {/* 썸네일 이미지 */}
        <div className="relative w-full h-[200px]">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* 뉴스 제목 */}
        <div className="p-4">
          <h3 className="font-medium text-lg line-clamp-2">{news.title}</h3>
          <p className="text-gray-500 text-sm mt-2">{news.date}</p>
        </div>
      </div>
    </Link>
  );
} 