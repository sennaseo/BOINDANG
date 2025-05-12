'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

export default function SignUpComplete() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-32 h-32 bg-[#F5F1FF] rounded-full flex items-center justify-center mb-6">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#6C2FF2" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3">회원가입 완료!</h1>
        <p className="text-gray-600 mb-8">
          복잡했던 식품 라벨 분석과 맞춤 영양 리포트, <br />
          이제 보인당과 함께 쉽고 재미있게 관리해보세요!
        </p>
      </div>

      <div className="px-6 py-5 w-full bg-white">
        <Button
          type="button"
          text="네 좋아요!"
          onClick={goToLogin}
        />
      </div>
    </div>
  );
} 