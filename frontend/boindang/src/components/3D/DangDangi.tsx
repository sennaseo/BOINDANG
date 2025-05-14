import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// 모델 미리 로드
useGLTF.preload('/assets/sugarcube/당당이1.glb');

// 배경 옵션
type BackgroundType = {
  color?: number;
  name: string;
};

const backgrounds: Record<string, BackgroundType> = {
  white: { color: 0xffffff, name: '화이트' },
  lightBlue: { color: 0xe6f2ff, name: '연한 파랑' },
  lightPink: { color: 0xffe6e6, name: '연한 핑크' },
  lightYellow: { color: 0xffffcc, name: '연한 노랑' },
  gradient: { name: '그라데이션' }
};

function DangDangiModel() {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/assets/sugarcube/당당이1.glb', true);
  
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
              child.material.emissiveIntensity = 0.3;
            }
            
            child.material.toneMapped = false;
            if ('color' in child.material) {
              const color = child.material.color;
              child.material.color = new THREE.Color(
                Math.min(color.r * 1.3, 1),
                Math.min(color.g * 1.3, 1),
                Math.min(color.b * 1.3, 1)
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
      scale={0.7}
      position={[0, -0.2, 0]}
      rotation={[0, 0, 0]} 
    />
  );
}

// 배경 컴포넌트
function Background({ type = 'white' }) {
  const { scene } = useThree();
  
  useEffect(() => {
    if (type === 'gradient') {
      // 그라데이션 배경 설정
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#e6f2ff');
        gradient.addColorStop(1, '#ffffff');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 512);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        scene.background = texture;
      }
    } else {
      // 단색 배경 설정
      const bgColor = backgrounds[type]?.color || 0xffffff;
      scene.background = new THREE.Color(bgColor);
    }
  }, [scene, type]);
  
  return null;
}

// 로딩 컴포넌트
function Loader() {
  return (
    <Html center>
      <div className="text-maincolor">로딩 중...</div>
    </Html>
  );
}

export default function DangDangi() {
  const [backgroundType, setBackgroundType] = useState<string>('white');
  
  // 배경 변경 함수
  const changeBackground = (type: string) => {
    setBackgroundType(type);
  };
  
  return (
    <div className="w-full h-[250px]">
      <div className="w-full h-full relative">
        <Canvas 
          camera={{ position: [5, 2, 0], fov: 30 }}
          gl={{ 
            powerPreference: 'low-power', 
            antialias: false,
            alpha: true
          }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          style={{
            borderRadius: '10px'
          }}
        >
          <Background type={backgroundType} />
          <Suspense fallback={<Loader />}>
            {/* 조명 설정 */}
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} />
            <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1.5} />
            <hemisphereLight args={[0xffffff, 0xffffff, 1]} />
            
            <DangDangiModel />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              rotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
        
        {/* 배경 선택 버튼 */}
        <div className="absolute top-5 left-0 right-0 flex justify-center gap-2">
          {Object.entries(backgrounds).map(([key, bg]) => (
            <button
              key={key}
              onClick={() => changeBackground(key)}
              className={`px-2 py-1 text-xs rounded-full ${
                backgroundType === key 
                  ? 'bg-maincolor text-white' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {bg.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 