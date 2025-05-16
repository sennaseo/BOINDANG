'use client';

import { useRouter } from 'next/navigation';
import BottomNavBar from '../../components/navigation/BottomNavBar';
import Image from 'next/image';
export default function QuizIntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ede9fe] to-white flex flex-col max-w-screen-sm mx-auto relative overflow-hidden">
      {/* 상단 연보라 원 */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#c4b5fd] opacity-30 rounded-full z-0" />
      {/* 하단 연보라 원 */}
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#c4b5fd] opacity-20 rounded-full z-0" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <Image
          src="/assets/quiz/sugar_quiz.png"
          alt="설탕 퀴즈"
          width={256}
          height={256}
          className="w-64 h-64 object-contain mb-8"
        />
        <h1 className="text-2xl font-bold mb-2 text-center">
          당신의 영양 지식을 테스트해보세요!
        </h1>
        <p className="text-gray-600 text-center mb-6">
          오늘의 퀴즈로 건강 상식을 점검해볼 시간이에요.
        </p>
        <button
          className="bg-[#6C2FF2] text-white px-6 py-3 rounded-full text-base font-semibold max-w-[140px] w-full"
          onClick={() => router.push('/quiz/play')}
        >
          퀴즈 시작하기
        </button>
      </div>
      <BottomNavBar />
    </div>
  );
}
