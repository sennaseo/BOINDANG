import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';

export default function QuizHeader() {
  return (
    <div className="flex flex-row items-center mb-6">
      <Link href="/more">
        <ArrowLeft size={24} weight="bold" fill="#363636" className="mr-3" />
      </Link>
      <h1 className="text-xl font-bold text-[#363636]">내 퀴즈</h1>
    </div>
  );
} 