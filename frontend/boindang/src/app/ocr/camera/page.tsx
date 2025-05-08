"use client";

import { useState, useEffect, useRef, ChangeEvent } from 'react';
// next/navigation에서 useRouter 임포트
import { useRouter } from 'next/navigation';
// Phosphor 아이콘 사용을 위해 import (ReadCvLogo 추가)
import { X, Image as ImageIcon, ReadCvLogo } from '@phosphor-icons/react';

export default function OcrCameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const guideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // useRouter 훅 사용
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGuideVisible, setIsGuideVisible] = useState(true);

  const showGuideTemporarily = () => {
    if (guideTimeoutRef.current) {
      clearTimeout(guideTimeoutRef.current);
    }
    setIsGuideVisible(true);
    guideTimeoutRef.current = setTimeout(() => {
      setIsGuideVisible(false);
    }, 3000);
  };

  useEffect(() => {
    showGuideTemporarily();

    let currentStream: MediaStream | null = null;

    const getCameraStream = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("카메라 접근 오류:", err);
        let errorMessage = "알 수 없는 카메라 오류가 발생했습니다.";
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            errorMessage = "카메라 접근 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.";
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMessage = "사용 가능한 카메라를 찾을 수 없습니다.";
          } else {
            errorMessage = `카메라를 시작하는 중 오류가 발생했습니다: ${err.message}`;
          }
        }
        setError(errorMessage);

        try {
          console.log("후면 카메라 실패, 전면 카메라 시도...");
          const frontConstraints: MediaStreamConstraints = { video: { facingMode: 'user' }, audio: false };
          currentStream = await navigator.mediaDevices.getUserMedia(frontConstraints);
          setStream(currentStream);
          setError(null);
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
          }
        } catch (frontErr) {
          console.error("전면 카메라 접근 오류:", frontErr);
        }
      }
    };

    getCameraStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        console.log("카메라 스트림 정리됨");
      }
      if (guideTimeoutRef.current) {
        clearTimeout(guideTimeoutRef.current);
        console.log("가이드 타임아웃 정리됨");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAlbumClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 'X' 버튼 클릭 핸들러 (뒤로 가기)
  const handleCloseClick = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white">
      <div className="h-16 flex justify-between items-center p-4 z-10">
        <button className="p-2" onClick={handleCloseClick}>
          <X size={28} weight="bold" />
        </button>
        <button onClick={showGuideTemporarily} className="text-sm font-semibold px-3 py-1.5 rounded bg-black bg-opacity-40">
          촬영 가이드
        </button>
      </div>

      <div className="flex-grow relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {isGuideVisible && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 z-20 p-8">
            <ReadCvLogo size={48} weight="bold" className="mb-4 text-[#6C2FF2]" />
            <p className="text-center text-lg mb-2 whitespace-pre-line font-semibold">
              식품 표시사항 전체를 촬영해주세요
            </p>
            <p className="text-center text-sm mb-4 whitespace-pre-line">
              빛이 반사된다면, 촬영 각도를 살짝 조절해보세요{'\n'}
              원재료 성분을 AI가 분석해드려요
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
            <p className="text-center">{error}</p>
          </div>
        )}
      </div>

      <div className="h-28 flex justify-between items-center px-8 py-4 z-10">
        <button className="p-2" onClick={handleAlbumClick}>
          <ImageIcon size={32} />
        </button>
        <button className="w-16 h-16 rounded-full border-4 border-white bg-transparent flex items-center justify-center active:bg-white/20">
          <div className="w-12 h-12 rounded-full bg-white"></div>
        </button>
        <div className="w-[48px]"></div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
