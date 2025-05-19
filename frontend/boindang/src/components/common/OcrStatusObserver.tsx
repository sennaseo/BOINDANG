"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

type OcrAnalysisStatus = 'processing' | 'completed' | 'error' | 'attempted' | null;

export default function OcrStatusObserver() {
  const router = useRouter();
  const { showToast, hideToast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    const updateToastBasedOnStorage = () => {
      const status = localStorage.getItem('ocrAnalysisState') as OcrAnalysisStatus;
      const messageFromStorage = localStorage.getItem('ocrAnalysisMessage');
      const resultIdFromStorage = localStorage.getItem('ocrResultId');
      // const navigatedHome = localStorage.getItem('ocrUserNavigatedHome'); // 이 변수는 여기서는 직접 사용되지 않음

      console.log("[OcrStatusObserver] Checking OCR Status from localStorage:", { status, messageFromStorage, resultIdFromStorage, pathname });

      if (status === 'processing' && messageFromStorage) {
        hideToast(); // 이전 토스트가 있다면 닫음
        showToast({
          message: messageFromStorage,
          type: 'loading',
          closable: false,
          duration: 0, // 사라지지 않음
        });
      } else if (status === 'completed' && messageFromStorage && resultIdFromStorage) {
        if (pathname !== '/ocr/camera' && !pathname?.startsWith('/report/')) {
          hideToast(); // 이전 토스트가 있다면 닫음
          const currentResultId = resultIdFromStorage; // 클로저를 위해 변수 할당
          showToast({
            message: messageFromStorage,
            type: 'success',
            closable: true,
            actionButton: {
              text: '결과 보기',
              onClick: () => {
                if (currentResultId) {
                  router.push(`/report/${currentResultId}`);
                  hideToast(); // 페이지 이동 후 토스트 닫기
                  // 상태는 ReportPage에서 정리하므로 여기서는 중복 제거하지 않음
                }
              },
            },
            duration: 0, // 사라지지 않음
          });
        } else {
          console.log(`[OcrStatusObserver] Suppressing 'completed' toast on ${pathname} page.`);
          // 해당 페이지에서는 이미 결과를 보여주거나 처리 중이므로, 불필요한 토스트를 닫을 필요가 있다면 hideToast() 호출
          // 하지만, 다른 종류의 토스트(예: processing)가 떠있을 수 있으므로, 명시적으로 completed만 억제
        }
      } else if (status === 'error' && messageFromStorage) {
        hideToast(); // 이전 토스트가 있다면 닫음
        showToast({
          message: messageFromStorage,
          type: 'error',
          closable: true,
          duration: 0, // 사용자가 직접 닫거나 액션 버튼을 누르도록 자동 닫힘 방지
          actionButton: {
            text: '다시 촬영',
            onClick: () => {
              router.push('/ocr/camera');
              hideToast(); // 페이지 이동 후 토스트 닫기
              // 상태는 CameraPage에서 다시 시도 시 또는 ReportPage에서 정리됨
            },
          },
        });
      } else {
        // 위 조건에 해당하지 않으면 (null이거나 예상치 못한 값) 현재 토스트를 닫음
        // console.log("[OcrStatusObserver] No active OCR toast status, or status cleared. Hiding current toast if any.");
        // hideToast(); // 상태가 명확하지 않을 때 무조건 닫는 것은 원치 않는 동작을 유발할 수 있음. 마지막 상태가 유지되도록 이 줄은 주석 처리.
      }
    };

    // 컴포넌트 마운트 시 즉시 한번 실행
    updateToastBasedOnStorage();

    // BroadcastChannel 리스너 설정
    const channel = new BroadcastChannel('ocr_status_channel');
    const handleChannelMessage = (event: MessageEvent) => {
      console.log("[OcrStatusObserver] BroadcastChannel message received:", event.data);
      if (event.data && typeof event.data.status === 'string') {
        updateToastBasedOnStorage();
      } else {
        console.warn("[OcrStatusObserver] Received invalid BroadcastChannel message:", event.data);
      }
    };
    channel.addEventListener('message', handleChannelMessage);

    // storage 이벤트 리스너 설정
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'ocrAnalysisState' || event.key === 'ocrAnalysisMessage' || event.key === 'ocrResultId') {
        console.log("[OcrStatusObserver] Storage changed, updating toast:", { key: event.key, newValue: event.newValue });
        updateToastBasedOnStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.removeEventListener('message', handleChannelMessage);
      channel.close();
      // 컴포넌트 언마운트 시 현재 떠 있는 ocr 관련 토스트를 닫을지 여부는 정책에 따라 결정
      // hideToast(); // 예를 들어, 페이지 이동 시 토스트를 강제로 닫고 싶다면 추가
    };
  }, [showToast, hideToast, router, pathname]); // pathname을 의존성 배열에 추가

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
} 