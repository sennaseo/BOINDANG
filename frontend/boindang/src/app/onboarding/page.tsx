'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const onboardingContent = [
  {
    title: '건강을 위한 똑똑한 한 걸음',
    description: '제로? 저당? 포장만 믿지 마세요.\n이제, 성분의 진짜 의미를 알고 선택하세요.',
  },
  {
    title: '성분표, 쉽고 정확하게',
    description: 'AI가 원재료를 해석하고, \n 혈당·건강 위험 성분까지 한눈에 알려드립니다.',
  },
  {
    title: '지금, 건강한 선택을 시작하세요!',
    description: '한 번의 스캔으로, 더 현명한 선택. \n 보인당과 함께 진짜 건강을 찾아보세요.',
  },
];

export default function OnboardingPage() {
  const [page, setPage] = useState(0);
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* 배경 이미지 슬라이더 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          <motion.div
            className="relative w-full h-full"
            animate={{
              x: `${-100 * page}%`,
            }}
            transition={{
              duration: 2.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <div className="absolute w-[300%] h-full">
              <Image
                src="/assets/onboarding/wave.png"
                alt="Wave Background"
                fill
                priority
                style={{
                  objectFit: 'cover',
                  maxWidth: '120%',
                  maxHeight: '120vh',
                  transform: 'scale(1.2)'
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 각설탕 캐릭터 */}
      <div className="relative z-10 flex justify-center items-center h-[60vh] max-h-[600px]">
        <motion.div
          animate={{
            x: page === 0 ? '-50%' : page === 1 ? '-35%' : '50%',
            y: page === 0 ? '-5vh' : page === 1 ? '15vh' : '5vh',
            opacity: 1
          }}
          transition={{
            duration: 2.5,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <motion.div
            animate={{ opacity: [0, 1] }}
            transition={{
              duration: 0.5,
              delay: 2
            }}
          >
            <motion.div
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 max-w-[208px] relative"
              animate={{
                y: [-10, 10],
                rotate: [-5, 5],
              }}
              transition={{
                y: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
            >
              <Image
                src={`/assets/onboarding/sugar${page + 1}.png`}
                alt="Sugar Character"
                fill
                sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, 13rem"
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col justify-end pb-20 px-8">
        {/* 텍스트 콘텐츠 */}
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {onboardingContent[page].title}
          </h2>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {onboardingContent[page].description}
          </p>
        </motion.div>

        {/* 하단 네비게이션 */}
        <div className="flex flex-col items-center gap-6">
          {/* 페이지 인디케이터 */}
          <div className="flex gap-2">
            {[0, 1, 2].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === page
                  ? 'bg-[#6C2FF2] w-4'
                  : 'bg-[#D4C6FF]'
                  }`}
              />
            ))}
          </div>

          {/* 버튼 영역 */}
          <div className="w-full flex justify-between items-center px-4">
            {/* Skip 버튼 */}
            {page !== 2 && (
              <motion.button
                onClick={() => router.push('/login')}
                className="text-[#6C2FF2] font-medium text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Skip
              </motion.button>
            )}

            {/* 다음/시작 버튼 */}
            <motion.button
              onClick={() => {
                if (page < 2) {
                  setPage(page + 1);
                } else {
                  router.push('/login');
                }
              }}
              className={`flex items-center justify-center transition-all duration-300
                ${page === 2
                  ? 'w-32 h-12 rounded-full bg-[#6C2FF2] text-white font-medium mx-auto'
                  : 'w-14 h-14 rounded-full bg-[#6C2FF2] ml-auto'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {page === 2 ? (
                "시작하기"
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
