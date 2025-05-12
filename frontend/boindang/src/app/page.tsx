import BottomNavBar from '@/components/navigation/BottomNavBar'; // 경로 확인

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 flex items-center justify-center pb-[70px]"> {/* 네비바 높이만큼 패딩 추가 */}
        <h1 className="text-2xl font-bold">메인 화면</h1>
      </main>

      {/* 하단 네비게이션 바 */}
      <BottomNavBar />
    </div>
  );
}
