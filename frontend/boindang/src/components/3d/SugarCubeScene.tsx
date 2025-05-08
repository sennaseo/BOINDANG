/**
 * SugarCubeScene.tsx
 * 
 * Three.js 씬 설정 및 3D GLB 모델 표시 컴포넌트
 * 
 * 이 컴포넌트는 3D 렌더링 환경을 설정하고 GLB 파일을 화면에 표시합니다.
 * - Canvas를 통해 Three.js 렌더링 환경을 생성합니다.
 * - 여러 조명을 배치하여 자연스러운 입체감을 만듭니다.
 * - PresentationControls와 OrbitControls로 사용자 인터랙션을 제공합니다.
 * - Suspense를 사용하여 로딩 처리를 관리합니다.
 * - useGLTF 훅을 사용하여 GLB 파일을 로드합니다.
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Environment, Center, ContactShadows, BakeShadows, useGLTF } from '@react-three/drei';
import { Vector3Tuple } from 'three';
import * as THREE from 'three';

// GlbModel 컴포넌트의 속성 타입 정의
interface GlbModelProps {
  url: string;
  scale?: number | Vector3Tuple;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
}

// GLB 모델을 로드하여 표시하는 컴포넌트
function GlbModel({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: GlbModelProps) {
  // useGLTF를 사용하여 GLB 파일 로드
  const gltf = useGLTF(url);
  
  return (
    <primitive 
      object={gltf.scene} 
      scale={scale} 
      position={position} 
      rotation={rotation} 
      castShadow 
      receiveShadow 
    />
  );
}

export default function SugarCubeScene() {
  // public 폴더의 GLB 파일 경로
  const glbUrl = '/models/sugar.glb';
  
  return (
    <div className="w-full h-full">
      {/* 
        Three.js Canvas - 3D 렌더링을 위한 기본 컨테이너
        - camera: 카메라 위치([x,y,z])와 시야각(fov) 설정
        - className: 캔버스가 부모 요소 크기에 맞게 표시되도록 설정
        - shadows: 그림자 렌더링 활성화
        - dpr: 장치 픽셀 비율 설정 (높을수록 더 선명하게 렌더링)
      */}
      <Canvas
        camera={{ position: [4, 1.5, 3.5], fov: 40 }}
        className="w-full h-full"
        shadows
        dpr={[1, 2]}
      >
        {/* 
          조명 설정 - 모델을 자연스럽게 비추기 위한 다중 조명
          - 주변광: 전체 장면에 은은한 빛
          - 스포트라이트: 옆면에서 비추는 강한 빛으로 강조
          - 포인트라이트: 여러 방향에서 비추는 작은 빛으로 디테일 강조
        */}
        <ambientLight intensity={0.7} color="#faf8f5" /> {/* 은은한 전체 조명 (따뜻한 색상) */}
        
        {/* 주 조명 - 측면에서 내리쬐는 빛 */}
        <spotLight 
          position={[-5, 7, 3]} 
          angle={0.3} 
          penumbra={1} 
          intensity={3.0} 
        />
        
        {/* 
          Suspense - 비동기 로딩을 처리하는 React 컴포넌트 
          fallback={null}: 로딩 중에는 아무것도 표시하지 않음
        */}
        <Suspense fallback={null}>
          {/* 
            PresentationControls - 마우스 드래그로 회전 가능한 인터랙션 제공
            - global: 전역 컨트롤 활성화
            - polar: Y축 회전 제한 (위아래)
            - azimuth: X축 회전 제한 (좌우)
          */}
          <PresentationControls
            global
            polar={[-Math.PI / 4, Math.PI / 4]} /* 상하 회전 제한 (45도) */
            azimuth={[-Math.PI / 4, Math.PI / 4]} /* 좌우 회전 제한 (45도) */
          >
            {/* Center - 객체를 씬의 중앙에 배치 */}
            <Center>
              {/* 그림자 효과 - 모델이 표면에 놓인 것 같은 효과 */}
              <ContactShadows
                opacity={0.2}
                scale={3}
                blur={0.5}
                far={5}
                resolution={128}
                color="#000000"
                position={[0, -0.3, 0]}
                height={0.05}
              />
              
              {/* GLB 모델 렌더링 */}
              <GlbModel 
                url={glbUrl} 
                scale={1} 
                position={[0, 0, 0]} 
                rotation={[0, 0, 0]} 
              />
            </Center>
          </PresentationControls>
          
          {/* 
            Environment - 환경 조명 및 배경 설정
            preset="warehouse": 부드러운 직접 조명과 약간의 간접 조명 효과
          */}
          <Environment preset="warehouse" background={false} />
          <BakeShadows />
        </Suspense>
        
        {/* 
          OrbitControls - 카메라 조작 컨트롤
          - enableZoom: 확대/축소 기능 비활성화
          - enablePan: 화면 이동 기능 비활성화
          - minPolarAngle/maxPolarAngle: 상하 회전 각도 제한
        */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4} /* 최소 상하 각도 (45도) */
          maxPolarAngle={Math.PI / 1.5} /* 최대 상하 각도 (120도) */
        />
      </Canvas>
    </div>
  );
} 