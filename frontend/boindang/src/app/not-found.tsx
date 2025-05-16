import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      <div className="mb-8">
        <Image
          src="/assets/quiz/sugar_X.png"
          alt="페이지를 찾을 수 없습니다."
          width={236}
          height={236}
          priority
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        이런! 페이지를 찾을 수 없어요
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        찾으시는 페이지가 존재하지 않거나 <br />
        이동 또는 삭제되었을 수 있습니다
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#6C2FF2] text-white font-semibold rounded-lg shadow-md hover:bg-[#5827b7] transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
