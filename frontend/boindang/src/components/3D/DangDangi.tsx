import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// 모델 미리 로드
useGLTF.preload('/assets/3D/당당이default.glb');
useGLTF.preload('/assets/3D/당당이애교.glb');
useGLTF.preload('/assets/3D/당당이춤.glb');

// 냉장고 내부 환경 컴포넌트 - 삭제
// function RefrigeratorInterior() { ... }

// 냉장고 조명 설정
function RefrigeratorLighting() {
  // 냉장고 크기에 맞게 조정된 조명 위치
  const topLightY = 1.5; // 위쪽 조명 Y 위치
  
  return (
    <>
      {/* 메인 조명 - 매우 밝게 */}
      <ambientLight intensity={2} color={0xffffff} />
      
      {/* 윗부분 조명 - 매우 밝게 */}
      <pointLight 
        position={[0, topLightY, 1]} 
        intensity={0.5} 
        color={0xffffff} 
        distance={50}
        decay={1}
      />
      
      {/* 스포트라이트 - 매우 밝게 */}
      <spotLight 
        position={[0, topLightY, 3]} 
        angle={0.8} 
        penumbra={0.5} 
        intensity={10} 
        color={0xffffff}
        castShadow={false}
      />
      
      {/* 측면 조명 - 강화 */}
      <pointLight 
        position={[6, 3, 0]} 
        intensity={10} 
        color={0xffffff} 
        distance={12}
      />
      
      {/* 하단 조명 - 추가 */}
      <pointLight 
        position={[0, -3, 0]} 
        intensity={1} 
        color={0xffffff} 
        distance={12}
      />
    </>
  );
}

function DangDangiModel() {
  const modelRef = useRef<THREE.Group>(null);
  const [modelPath, setModelPath] = useState('/assets/3D/당당이default.glb');
  const { scene, animations } = useGLTF(modelPath, true);
  const { actions } = useAnimations(animations, modelRef);
  
  // 클릭 관련 상태
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  
  // 더블 클릭 감지 타이머
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 애니메이션 재생
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // 모델에 따라 애니메이션 재생 방식 설정
      if (modelPath === '/assets/3D/당당이애교.glb') {
        // 애교 모델은 애니메이션을 한 번만 재생
        Object.values(actions).forEach((action) => {
          if (action) {
            action.reset().play();
            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true; // 애니메이션 끝 상태 유지
          }
        });
      } else {
        // 다른 모델은 애니메이션 반복 재생
        Object.values(actions).forEach((action) => {
          if (action) {
            action.reset().play();
            action.loop = THREE.LoopRepeat;
          }
        });
      }
    }
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (longPressTimer) clearTimeout(longPressTimer);
    };
  }, [actions, longPressTimer, modelPath]);
  
  // 모델 변경 후 원래 모델로 복귀
  useEffect(() => {
    if (modelPath !== '/assets/3D/당당이default.glb') {
      const timer = setTimeout(() => {
        setModelPath('/assets/3D/당당이default.glb');
        setIsLongPress(false);
      }, 3000); // 3초 후 기본 모델로 복귀
      
      return () => clearTimeout(timer);
    }
  }, [modelPath]);
  
  // 클릭 이벤트 핸들러
  const handleClick = () => {
    if (isLongPress) return; // 길게 누르는 중이면 클릭 무시
    
    // 더블 클릭 감지
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      
      // 더블 클릭 시 애교 모델로 변경
      setModelPath('/assets/3D/당당이애교.glb');
    } else {
      // 싱글 클릭 타이머 설정
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
      }, 300); // 300ms 내에 두 번째 클릭이 없으면 싱글 클릭으로 처리
    }
  };
  
  // 마우스 누르기 시작
  const handlePointerDown = () => {
    const timer = setTimeout(() => {
      // 길게 누르면 춤 모델로 변경
      setModelPath('/assets/3D/당당이춤.glb');
      setIsLongPress(true);
    }, 1000); // 800ms 이상 누르면 길게 누름으로 처리
    
    setLongPressTimer(timer);
  };
  
  // 마우스 누르기 종료
  const handlePointerUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // 길게 누름 상태가 아니면 클릭 이벤트 처리
    if (!isLongPress) {
      handleClick();
    }
  };
  
  // 마우스 이탈 처리
  const handlePointerOut = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  // 최적화 및 밝기 조정
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          
          if (child.material) {
            child.material.precision = 'lowp';
            
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive = new THREE.Color(0x333333);
              child.material.emissiveIntensity = 0.5; // 발광 강화
            }
            
            child.material.toneMapped = false;
            if ('color' in child.material) {
              const color = child.material.color;
              child.material.color = new THREE.Color(
                Math.min(color.r * 1.5, 1), // 밝기 강화
                Math.min(color.g * 1.5, 1),
                Math.min(color.b * 1.5, 1)
              );
            }
          }
        }
      });
    }
  }, [scene]);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={0.4}
      position={[0, 0.4, 0]}
      rotation={[0, -Math.PI / 2, 0]} 
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerOut}
    />
  );
}

// 로딩 컴포넌트
function Loader() {
  return (
    <Html center>
      <div className="text-maincolor font-medium animate-pulse">로딩 중...</div>
    </Html>
  );
}

export default function DangDangi() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full relative">
        <Canvas 
          camera={{ position: [0.2, 1, 5], fov: 40 }}
          gl={{ 
            powerPreference: 'low-power', 
            antialias: true,
            alpha: true
          }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={<Loader />}>
            <RefrigeratorLighting />
            
            <DangDangiModel />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              rotateSpeed={0.6}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
} 