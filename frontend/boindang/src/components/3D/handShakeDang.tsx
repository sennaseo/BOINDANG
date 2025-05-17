"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  onClick?: () => void;
}

function Model({ onClick }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  // public 폴더의 glb 파일 경로를 정확히 지정해야 합니다.
  // Next.js에서 public 폴더는 기본적으로 웹 루트에서 접근 가능합니다.
  const { scene, animations } = useGLTF('/assets/3D/당당이손흔들기.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    // 로드된 애니메이션 중 첫 번째 애니메이션을 재생합니다.
    // 모델에 여러 애니메이션이 있거나 특정 이름을 가진 애니메이션을 재생해야 한다면 이 부분을 수정해야 합니다.
    if (actions && animations.length > 0) {
      const animationName = animations[0].name;
      actions[animationName]?.play();
    }
  }, [actions, animations, mixer]);

  // 모델의 크기, 위치, 회전 등을 조정해야 할 수 있습니다.
  // scene.scale.set(1, 1, 1);
  // scene.position.set(0, -1, 0); // 예시: 모델이 바닥에 있도록 y축 조정

  return (
    <primitive
      ref={group}
      object={scene}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation(); // 이벤트 버블링 방지
        if (onClick) {
          onClick();
        }
        console.log('3D Model clicked!');
      }}
      scale={1} // 모델이 작을 경우 크기 조절 (예시)
      position={[0, 0, 0]} // 모델 위치 조절 (예시)
      rotation={[0, -Math.PI / 2, 0]} // 모델 회전 (y축 -90도)
    />
  );
}

interface HandShakeDangProps {
  onCharacterClick?: () => void;
}

export default function HandShakeDang({ onCharacterClick }: HandShakeDangProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 30 }} // 카메라 위치 및 시야각 조절
      style={{ touchAction: 'none' }} // 모바일 환경 터치 제스처 충돌 방지
    >
      <ambientLight intensity={1.5} /> {/* 전체적인 주변광 */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      /> {/* 그림자를 만드는 주 조명 */}
      <pointLight position={[-5, -5, -5]} intensity={1} /> {/* 보조 조명 */}

      <Model onClick={onCharacterClick} />

      {/* OrbitControls는 개발 중에 카메라를 조작하여 모델을 여러 각도에서 보기 편하게 해줍니다. */}
      {/* 실제 프로덕션에서는 제거하거나 필요에 따라 유지할 수 있습니다. */}
      {/* <OrbitControls
        enableZoom={true} // 줌 활성화 (디버깅용)
        enablePan={true} // 패닝 활성화 (디버깅용)
        // minPolarAngle={Math.PI / 2.2} // 수직 회전 최소 각도 (디버깅 중에는 주석 처리)
        // maxPolarAngle={Math.PI / 2.2} // 수직 회전 최대 각도 (디버깅 중에는 주석 처리)
        enableRotate={true} // 전체 회전 활성화 (디버깅용)
      /> */}
    </Canvas>
  );
}

// GLTF 파일 로딩 시 에러가 발생하면, public 폴더 경로 및 파일 이름이 정확한지,
// 그리고 GLB 파일 자체가 유효한지 확인해주세요.
// 또한, `next.config.js` 에 특별한 설정이 필요할 수도 있습니다 (일반적으로는 불필요). 