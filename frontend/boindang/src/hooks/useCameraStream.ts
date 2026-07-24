import { useCallback, useEffect, useRef, useState } from 'react';

// MediaStream의 모든 트랙을 정지시키는 헬퍼
const stopMediaStream = (mediaStream: MediaStream | null) => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
  }
};

interface UseCameraStreamResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  getCameraStream: () => Promise<void>;
  stopCameraStream: () => void;
}

/**
 * 카메라(getUserMedia) 스트림 획득/폴백/정리 로직을 담당하는 훅.
 * - 후면(environment) 카메라 실패 시 전면(user) 카메라로 폴백.
 * - 활성 스트림은 ref로 관리하여, 언마운트 시에만 트랙을 정지한다.
 */
export function useCameraStream(): UseCameraStreamResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStreamBeingInitialized = useRef(false); // 재진입 호출 방지 플래그

  const [error, setError] = useState<string | null>(null);

  // 현재 활성 스트림 정지 (videoRef와 내부 ref 모두 정리)
  const stopCameraStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      stopMediaStream(videoRef.current.srcObject as MediaStream);
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    }
  }, []);

  const getCameraStream = useCallback(async () => {
    if (isStreamBeingInitialized.current) {
      console.log('[Camera] Stream initialization already in progress. Skipping.');
      return;
    }
    console.log('[Camera] Attempting to get camera stream...');
    isStreamBeingInitialized.current = true;

    // 새 스트림을 얻기 전에 기존 스트림을 정지
    if (videoRef.current && videoRef.current.srcObject) {
      console.log('[Camera] Stopping existing stream on videoRef.');
      stopMediaStream(videoRef.current.srcObject as MediaStream);
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      console.log('[Camera] Stopping existing stream from ref before new attempt.');
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      };
      console.log('[Camera] Requesting user media with constraints:', constraints);
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('[Camera] Got new stream:', newStream);
      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        console.log('[Camera] Stream assigned to video element. videoRef.current.videoWidth:', videoRef.current.videoWidth);
        videoRef.current.onloadedmetadata = () => {
          console.log('[Camera] Video metadata loaded. Width:', videoRef.current?.videoWidth, 'Height:', videoRef.current?.videoHeight);
        };
        videoRef.current.onplaying = () => {
          console.log('[Camera] Video started playing.');
        };
      } else {
        console.warn('[Camera] videoRef.current is null when trying to assign stream.');
      }
      setError(null);
    } catch (err) {
      console.error('[Camera] Error getting rear camera:', err);
      try {
        console.log('[Camera] Rear camera failed, trying front camera...');
        const frontConstraints: MediaStreamConstraints = { video: { facingMode: 'user' }, audio: false };
        const frontStream = await navigator.mediaDevices.getUserMedia(frontConstraints);
        console.log('[Camera] Got front stream:', frontStream);
        streamRef.current = frontStream;
        if (videoRef.current) {
          videoRef.current.srcObject = frontStream;
          console.log('[Camera] Front stream assigned to video element.');
        }
        setError(null);
      } catch (frontErr) {
        console.error('[Camera] Error getting front camera:', frontErr);
        streamRef.current = null;
      }
    } finally {
      isStreamBeingInitialized.current = false;
      console.log('[Camera] Stream initialization finished.');
    }
  }, []);

  // 언마운트 시에만 스트림 정지 (렌더 중간에 취약하게 stop되지 않도록 ref 기반 정리)
  useEffect(() => {
    return () => {
      console.log('[Camera] Unmount cleanup: stopping camera stream.');
      stopCameraStream();
    };
  }, [stopCameraStream]);

  return { videoRef, error, setError, getCameraStream, stopCameraStream };
}
