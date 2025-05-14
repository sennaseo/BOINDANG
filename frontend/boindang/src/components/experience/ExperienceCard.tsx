import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ExperienceCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  remainingDays: number | string;
  maxParticipants?: number;
  openDateTime?: string;
}

export type { ExperienceCardProps };
export default function ExperienceCard({
  id,
  title,
  description,
  imageUrl,
  tags,
  remainingDays,
  maxParticipants = 0,
  openDateTime = '',
}: ExperienceCardProps) {
  return (
    <Link href={`/experience/${id}`}>
      <motion.div 
        className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* 이미지 */}
        <div className="relative w-full h-[200px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
            {typeof remainingDays === 'string' ? remainingDays : `${remainingDays}일 남음`}
          </div>
          {openDateTime && (
            <div className="absolute bottom-4 left-4 bg-[#6C2FF2] text-white px-3 py-1 rounded-full text-xs">
              {openDateTime} 오픈
            </div>
          )}
          {typeof remainingDays === 'string' && remainingDays === '종료' && (
            <div className="absolute inset-0 bg-black/40 z-10 rounded-t-2xl pointer-events-none" />
          )}
        </div>

        {/* 컨텐츠 */}
        <div className="p-4">
          {/* 제품 정보 */}
          <div className="mb-3">
            {maxParticipants > 0 && (
              <div className="mb-2">
                <span className="text-[#6C2FF2] font-semibold text-sm">
                  선착순 {maxParticipants}명
                </span>
              </div>
            )}
            <h3 className="font-medium text-base mb-1">{title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {description}
            </p>
          </div>

          {/* 해시태그 */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
} 