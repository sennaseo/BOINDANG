"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import ToastNotification from '@/components/common/ToastNotification'; // 경로 확인

interface ToastAction {
  text: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface ToastState {
  id: string; // 여러 토스트가 동시에 뜨는 것을 방지하거나 관리하기 위한 ID
  message: string;
  type: 'info' | 'success' | 'error' | 'loading';
  duration?: number; // 자동 닫힘 시간 (ms). 0 또는 undefined면 자동 안 닫힘
  closable?: boolean;
  actionButton?: ToastAction;
  visible: boolean;
}

interface ToastContextType {
  showToast: (options: Omit<ToastState, 'id' | 'visible'>) => void;
  hideToast: (toastIdToHide?: string) => void; // string ID를 받도록 변경
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentToastIdRef = useRef<string | null>(null); // 현재 표시 중인 토스트의 ID를 추적

  const hideToast = useCallback((toastIdToHide?: string) => {
    console.log(`[ToastContext] hideToast called. Current toast ID in ref: ${currentToastIdRef.current}, ID to hide: ${toastIdToHide}`);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    // ID가 제공되지 않았거나 (모든 토스트 닫기 요청 간주), 
    // 제공된 ID가 현재 활성화된 토스트의 ID와 일치하면 닫습니다.
    if (!toastIdToHide || (currentToastIdRef.current && toastIdToHide === currentToastIdRef.current)) {
      console.log("[ToastContext] Setting toast to null. ID matched or no ID passed for hiding.");
      setToast(null);
      currentToastIdRef.current = null; // 현재 토스트 ID도 초기화
    } else if (toastIdToHide && currentToastIdRef.current && toastIdToHide !== currentToastIdRef.current) {
      console.log("[ToastContext] Not hiding toast (ID mismatch).", { currentToastIdInRef: currentToastIdRef.current, requestedHideId: toastIdToHide });
    } else if (toastIdToHide && !currentToastIdRef.current) {
      console.log("[ToastContext] Not hiding toast (no current toast to compare ID against).");
      // 이 경우에도 setToast(null)을 호출하여 혹시 모를 잔여 토스트를 정리할 수 있습니다.
      // 예를 들어, 컨텍스트 상태는 null인데 DOM에 남아있는 것처럼 보이는 경우 대비
      // setToast(null); 
    }
  }, [setToast, timeoutIdRef]); // 의존성 배열: setToast는 항상 안정적, timeoutIdRef는 ref이므로 안정적

  const showToast = useCallback((options: Omit<ToastState, 'id' | 'visible'>) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    // ID 생성 시 중복 가능성을 낮추기 위해 타입과 시간을 조합
    const newToastId = `${options.type}_${Date.now().toString()}`;
    console.log(`[ToastContext] showToast called. New toast ID: ${newToastId}`, options);

    currentToastIdRef.current = newToastId; // 새로운 토스트가 현재 활성화된 토스트임을 기록
    setToast({ ...options, id: newToastId, visible: true });

    if (options.duration && options.duration > 0) {
      timeoutIdRef.current = setTimeout(() => {
        // duration 이후에는 해당 ID의 토스트만 닫도록 hideToast 호출
        // 이때 hideToast는 currentToastIdRef.current와 newToastId를 비교하여 닫을지 결정
        hideToast(newToastId);
      }, options.duration);
    }
  }, [setToast, timeoutIdRef, hideToast]); // hideToast가 의존성에 추가됨 (hideToast는 이제 안정적이므로 괜찮음)

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && toast.visible && (
        <ToastNotification
          // key는 ToastNotification 자체의 리렌더링을 위함. toast.id가 적절.
          key={toast.id}
          message={toast.message}
          type={toast.type}
          actionButton={toast.actionButton}
          // onClose는 현재 표시된 toast의 id로 hideToast를 호출해야 함
          onClose={() => hideToast(toast.id)}
        />
      )}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 