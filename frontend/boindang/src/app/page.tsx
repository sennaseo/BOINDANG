import BottomNavBar from '@/components/navigation/BottomNavBar';
import SugarCubeContainer from '@/components/3d/SugarCubeContainer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center pb-[70px]">
        {/* 페이지 제목 */}
        <h1 className="text-2xl font-bold mb-8">메인화면</h1>
        {/* 
          3D 각설탕 캐릭터 컨테이너
          - w-full: 전체 너비 사용
          - h-[400px] md:h-[500px]: 반응형 높이 설정 (모바일: 400px, 태블릿 이상: 500px)
          - SugarCubeContainer: 클라이언트 컴포넌트로 Three.js 렌더링 처리
        */}
        <div className="w-full h-[400px] md:h-[500px]">
          <SugarCubeContainer />
        </div>
      </main>


      <BottomNavBar />
    </div>
  );
}
