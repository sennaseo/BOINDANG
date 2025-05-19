"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  onClick?: () => void;
  onAnimationFinish?: () => void;
  visible?: boolean;
}

function HandShakeModel({ onClick, visible = true }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/assets/3D/당당이손흔들기.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (visible && actions && animations.length > 0) {
      const animationName = animations[0].name;
      actions[animationName]?.reset().play();
    } else if (!visible && actions && animations.length > 0) {
      const animationName = animations[0].name;
      actions[animationName]?.stop();
    }
  }, [actions, animations, mixer, visible]);

  if (!visible) return null;

  return (
    <primitive
      ref={group}
      object={scene}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        if (onClick) {
          onClick();
        }
        console.log('HandShakeModel clicked!');
      }}
      scale={1}
      position={[0, 0, 0]}
      rotation={[0, -Math.PI / 2, 0]}
    />
  );
}

function RunningAwayModel({ visible = true, onAnimationFinish }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/assets/3D/당당이달리기.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (animations.length === 0) return;
    const animationName = animations[0].name;
    const action = actions && actions[animationName];

    if (action) {
      if (visible) {
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();

        const handleAnimationFinished = (event: { action: THREE.AnimationAction }) => {
          if (event.action === action) {
            console.log('RunningAwayModel animation finished by event');
            if (onAnimationFinish) {
              onAnimationFinish();
            }
            mixer.removeEventListener('finished', handleAnimationFinished);
          }
        };
        mixer.addEventListener('finished', handleAnimationFinished);
        return () => {
          mixer.removeEventListener('finished', handleAnimationFinished);
          if (action.isRunning()) action.stop();
        };
      } else {
        if (action.isRunning()) action.stop();
        action.reset();
      }
    }
  }, [actions, animations, mixer, visible, onAnimationFinish]);

  if (!visible) return null;

  return (
    <group rotation={[0, Math.PI / 0.9, 0]} position={[0, 0.1, 0]}>
      <primitive
        ref={group}
        object={scene}
        scale={1.5}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}

function WavingFromBehindModel({ visible = true, onAnimationFinish }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/assets/3D/당당이뒤에서손흔들기.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (animations.length === 0) return;
    const animationName = animations[0].name;
    const action = actions && actions[animationName];

    if (action) {
      if (visible) {
        console.log('WavingFromBehindModel: Playing animation (looping).');
        action.reset();
        action.play();

        let finishedEventFired = false;
        const handleFirstLoopFinished = (event: { action: THREE.AnimationAction }) => {
          if (event.action === action && !finishedEventFired) {
            console.log('WavingFromBehindModel first loop finished, calling onAnimationFinish if present.');
            if (onAnimationFinish) {
              onAnimationFinish();
            }
            finishedEventFired = true;
          }
        };

        mixer.addEventListener('loop', handleFirstLoopFinished);

        return () => {
          console.log('WavingFromBehindModel: Cleanup. Stopping animation.');
          mixer.removeEventListener('loop', handleFirstLoopFinished);
          if (action.isRunning()) {
            action.stop();
          }
        };
      } else {
        console.log('WavingFromBehindModel: Not visible. Stopping and resetting.');
        if (action.isRunning()) {
          action.stop();
        }
        action.reset();
      }
    }
  }, [actions, animations, mixer, visible, onAnimationFinish]);

  if (!visible) return null;

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.3}
      position={[1.2, 0, 0]}
      rotation={[0, -Math.PI / 2.8, 0]}
    />
  );
}

function RunningForwardModel({ visible = true, onAnimationFinish }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/assets/3D/당당이앞으로달리기.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    let action: THREE.AnimationAction | null | undefined = undefined;
    let animationNameForLogic: string | undefined = undefined;

    if (actions && Object.keys(actions).length > 0) {
      const keysFromActions = Object.keys(actions);
      animationNameForLogic = keysFromActions[0];
      action = actions[animationNameForLogic];

      if (animations.length > 0) {
        const nameFromClips = animations[0].name;
        if (nameFromClips !== animationNameForLogic) {
        }
      }
    } else if (animations.length === 0) {
    } else {
    }

    if (action && animationNameForLogic) {
      if (visible) {
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();

        const handleAnimationFinishedEvent = (event: { action: THREE.AnimationAction }) => {
          if (event.action === action) {
            console.log('RunningForwardModel animation finished by event');
            if (onAnimationFinish) {
              onAnimationFinish();
            }
            mixer.removeEventListener('finished', handleAnimationFinishedEvent);
          }
        };
        mixer.addEventListener('finished', handleAnimationFinishedEvent);

        return () => {
          mixer.removeEventListener('finished', handleAnimationFinishedEvent);
          if (action && action.isRunning()) {
            action.stop();
          }
        };
      } else {
        if (action) {
          if (action.isRunning()) {
            action.stop();
          }
          action.reset();
        }
      }
    } else {
      if (visible) {
      }
    }
  }, [actions, animations, mixer, visible, onAnimationFinish]);

  if (!visible) return null;

  return (
    <group rotation={[0, -Math.PI / 1.1, 0]} position={[0, 0.1, 0]}>
      <primitive
        ref={group}
        object={scene}
        scale={1.5}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}

interface HandShakeDangProps {
  onShouldShowTouchPrompt?: (shouldShow: boolean) => void;
  onShouldShowKnowledgeCard?: () => void;
  runForwardCommand?: boolean;
  onRunForwardAnimationFinished?: () => void;
}

type CurrentModelType = 'handShake' | 'runningAway' | 'wavingFromBehind' | 'runningForward';

export default function HandShakeDang({
  onShouldShowTouchPrompt,
  onShouldShowKnowledgeCard,
  runForwardCommand,
  onRunForwardAnimationFinished
}: HandShakeDangProps) {
  const [currentModel, setCurrentModel] = useState<CurrentModelType>('handShake');

  useEffect(() => {
    if (onShouldShowTouchPrompt) {
      const shouldShow = currentModel === 'handShake';
      onShouldShowTouchPrompt(shouldShow);
    }
  }, [currentModel, onShouldShowTouchPrompt]);

  useEffect(() => {
    if (runForwardCommand && currentModel === 'wavingFromBehind') {
      console.log("HandShakeDang: Received runForwardCommand while wavingFromBehind, transitioning to runningForward");
      setCurrentModel('runningForward');
    }
  }, [runForwardCommand, currentModel]);

  const handleHandShakeClick = useCallback(() => {
    console.log("HandShakeModel clicked, transitioning to runningAway");
    setCurrentModel('runningAway');
  }, []);

  const handleRunningAwayAnimationFinish = useCallback(() => {
    console.log("RunningAwayModel animation finished, transitioning to wavingFromBehind");
    setCurrentModel('wavingFromBehind');
  }, []);

  const handleWavingFromBehindAnimationFinish = useCallback(() => {
    console.log("WavingFromBehindModel animation finished, requesting knowledge card");
    if (onShouldShowKnowledgeCard) {
      onShouldShowKnowledgeCard();
    }
  }, [onShouldShowKnowledgeCard]);

  const handleRunningForwardAnimationFinish = useCallback(() => {
    console.log("RunningForwardModel animation finished, transitioning to handShake");
    setCurrentModel('handShake');
    if (onRunForwardAnimationFinished) {
      onRunForwardAnimationFinished();
    }
  }, [onRunForwardAnimationFinished]);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ touchAction: 'none' }}
      className="w-full h-full"
    >
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, -5, -5]} intensity={1} />
      <pointLight position={[0, -2, 2]} intensity={0.5} />

      <HandShakeModel
        onClick={handleHandShakeClick}
        visible={currentModel === 'handShake'}
      />
      <RunningAwayModel
        visible={currentModel === 'runningAway'}
        onAnimationFinish={handleRunningAwayAnimationFinish}
      />
      <WavingFromBehindModel
        visible={currentModel === 'wavingFromBehind'}
        onAnimationFinish={handleWavingFromBehindAnimationFinish}
      />
      <RunningForwardModel
        visible={currentModel === 'runningForward'}
        onAnimationFinish={handleRunningForwardAnimationFinish}
      />
    </Canvas>
  );
}

// GLTF 파일 로딩 시 에러가 발생하면, public 폴더 경로 및 파일 이름이 정확한지,
// 그리고 GLB 파일 자체가 유효한지 확인해주세요.
// 각 모델의 애니메이션 이름이 'animations[0].name'으로 되어있는데,
// 실제 GLB 파일에 포함된 애니메이션의 정확한 이름을 확인하고 필요시 수정해야 합니다. 