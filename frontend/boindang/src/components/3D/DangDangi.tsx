import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// 모델 미리 로드
useGLTF.preload('/assets/3D/당당이default.glb');
useGLTF.preload('/assets/3D/당당이애교.glb');
useGLTF.preload('/assets/3D/당당이춤.glb');

// 냉장고 내부 환경 컴포넌트
function RefrigeratorInterior() {
  // 냉장고 내부 색상
  const frostColor = new THREE.Color(0xdcf0ff);
  const white = new THREE.Color(0xffffff);
  
  // 냉장고 크기 조정
  const fridgeWidth = 20;  // 가로
  const fridgeHeight = 20; // 높이
  const fridgeDepth = 20;  // 깊이
  
  return (
    <group>
      {/* 냉장고 내부 바닥 */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fridgeWidth, fridgeDepth]} />
        <meshStandardMaterial color={white} metalness={0.1} roughness={0.1} />
      </mesh>
      
      {/* 냉장고 뒷벽 */}
      <mesh position={[0, 0, -fridgeDepth/2]}>
        <planeGeometry args={[fridgeWidth, fridgeHeight]} />
        <meshStandardMaterial color={white} metalness={0.1} roughness={0.1} />
      </mesh>
      
      {/* 냉장고 좌측 벽 */}
      <mesh position={[-fridgeWidth/2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[fridgeDepth, fridgeHeight]} />
        <meshStandardMaterial color={white} metalness={0.1} roughness={0.1} />
      </mesh>
      
      {/* 냉장고 우측 벽 */}
      <mesh position={[fridgeWidth/2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[fridgeDepth, fridgeHeight]} />
        <meshStandardMaterial color={white} metalness={0.1} roughness={0.1} />
      </mesh>
      
      {/* 냉장고 윗면 */}
      <mesh position={[0, fridgeHeight/2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fridgeWidth, fridgeDepth]} />
        <meshStandardMaterial color={white} metalness={0.1} roughness={0.1} />
      </mesh>
      
      {/* 냉장고 선반 */}
      <mesh position={[0, -0.7, -3]} rotation={[-Math.PI / 16, 0, 0]}>
        <boxGeometry args={[fridgeWidth * 0.7, 0.2, 5]} />
        <meshStandardMaterial color={frostColor} transparent opacity={0.7} />
      </mesh>
      
      {/* 냉장고 서리 효과 (위) */}
      <mesh position={[0, fridgeHeight/2 - 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fridgeWidth, fridgeDepth]} />
        <meshStandardMaterial 
          color={frostColor} 
          transparent 
          opacity={0.3}
          roughness={0.2}
          metalness={0.1}
          emissive={frostColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* 냉장고 서리 효과 (뒤) */}
      <mesh position={[0, 0, -fridgeDepth/2 + 0.1]}>
        <planeGeometry args={[fridgeWidth, fridgeHeight]} />
        <meshStandardMaterial 
          color={frostColor} 
          transparent 
          opacity={0.2}
          roughness={0.3}
          emissive={frostColor}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

// 냉장고 조명 설정
function RefrigeratorLighting() {
  // 냉장고 크기에 맞게 조정된 조명 위치
  const topLightY = 1.5; // 위쪽 조명 Y 위치
  
  return (
    <>
      {/* 냉장고 내부 메인 조명 - 매우 밝게 */}
      <ambientLight intensity={2} color={0xffffff} />
      
      {/* 냉장고 윗부분 조명 - 매우 밝게 */}
      <pointLight 
        position={[0, topLightY, 1]} 
        intensity={2.5} 
        color={0xffffff} 
        distance={20}
        decay={1}
      />
      
      {/* 냉장고 내부 스포트라이트 - 매우 밝게 */}
      <spotLight 
        position={[0, topLightY, 3]} 
        angle={0.8} 
        penumbra={0.5} 
        intensity={1} 
        color={0xffffff}
        castShadow={false}
      />
      
      {/* 측면 조명 - 강화 */}
      <pointLight 
        position={[6, 3, 0]} 
        intensity={1.5} 
        color={0xffffff} 
        distance={12}
      />
      
      {/* 정면 조명 - 밝게 */}
      <pointLight 
        position={[0, 0, 6]} 
        intensity={10} 
        color={0xffffff} 
        distance={5}
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

// 배경 설정 컴포넌트
function SceneBackground() {
  const { scene } = useThree();
  
  useEffect(() => {
    // 냉장고 내부 느낌의 차가운 푸른빛 색상
    scene.background = new THREE.Color(0xe8f5ff);
    scene.fog = new THREE.Fog(0xe8f5ff, 15, 30);
  }, [scene]);
  
  return null;
}

// 서리 파티클 효과
function FrostParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300; // 파티클 수 증가
  
  // 파티클 위치 초기화
  const positions = new Float32Array(count * 3);
  
  // 냉장고 크기에 맞는 파티클 분포 범위
  const rangeX = 10; // 냉장고 가로 크기의 절반
  const rangeY = 10; // 냉장고 높이의 절반
  const rangeZ = 10; // 냉장고 깊이의 절반
  
  for (let i = 0; i < count; i++) {
    // 냉장고 내부 공간에 랜덤하게 배치 - 조정된 범위
    positions[i * 3] = (Math.random() - 0.5) * rangeX * 2;  // x
    positions[i * 3 + 1] = Math.random() * rangeY - 0.5; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * rangeZ * 2; // z
  }
  
  // 파티클 애니메이션
  useFrame((state) => {
    if (particlesRef.current) {
      // 부드러운 떠다니는 효과
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // 위아래로 천천히 움직임 - 더 자연스럽게
        positions[i3 + 1] += Math.sin(state.clock.getElapsedTime() * 0.1 + i) * 0.0003;
        
        // 좌우로도 약간 움직임 추가
        positions[i3] += Math.sin(state.clock.getElapsedTime() * 0.05 + i * 2) * 0.0001;
        
        // 경계를 벗어나면 다시 위치 조정
        if (positions[i3 + 1] > rangeY) positions[i3 + 1] = -0.5;
        if (positions[i3 + 1] < -0.5) positions[i3 + 1] = rangeY;
        
        if (positions[i3] > rangeX) positions[i3] = -rangeX;
        if (positions[i3] < -rangeX) positions[i3] = rangeX;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  // 서로 다른 크기의 파티클 생성
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    sizes[i] = 0.03 + Math.random() * 0.08; // 더 다양한 크기의 파티클
  }
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={count}
          itemSize={1}
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation={true}
        color={0xffffff}
        transparent
        opacity={0.65}
        depthWrite={false}
        vertexColors={false}
        fog={true}
      />
    </points>
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
      position={[0, 0.4, -1]}
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
          camera={{ position: [0, 1, 10], fov: 20 }}
          gl={{ 
            powerPreference: 'low-power', 
            antialias: true,
            alpha: true
          }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
        >
          <SceneBackground />
          <Suspense fallback={<Loader />}>
            {/* 냉장고 환경과 조명 */}
            <RefrigeratorInterior />
            <RefrigeratorLighting />
            <FrostParticles />
            
            <DangDangiModel />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              rotateSpeed={0.5}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
        
        {/* 냉장고 효과 UI 오버레이 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 냉장고 문 테두리 효과 */}
          <div className="absolute inset-0 border-[20px] border-white/30 rounded-lg"></div>
          
          {/* 냉장고 내부 물방울 효과 - 강화 */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'radial-gradient(circle, transparent 80%, rgba(220,240,255,0.3) 100%)',
              mixBlendMode: 'screen'
            }}
          ></div>
          
          {/* 냉장고 내부 물방울 효과 - 추가 작은 물방울들 */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  filter: 'blur(1px)',
                  opacity: 0.3 + Math.random() * 0.5
                }}
              />
            ))}
          </div>
          
          {/* 냉장고 서리 효과 */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'linear-gradient(to bottom, rgba(240,248,255,0.15) 0%, transparent 20%)',
              mixBlendMode: 'screen'
            }}
          ></div>
          
          {/* 냉장고 문 모서리 반사 효과 */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 15%, transparent 85%, rgba(255,255,255,0.4) 100%)',
              mixBlendMode: 'overlay'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 