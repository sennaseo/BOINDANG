import { useEffect, RefObject } from 'react';

interface UsePreventSwipeBackOptions {
  /**
   * 화면 가장자리로부터 스와이프를 감지할 임계값 (픽셀 단위)
   * @default 30
   */
  edgeThreshold?: number;
}

/**
 * 지정된 요소에서 화면 가장자리 스와이프 뒤로가기 제스처를 방지하는 커스텀 훅.
 * iOS PWA 환경 등에서 유용합니다.
 *
 * @param targetRef 스와이프 방지 기능을 적용할 DOM 요소에 대한 RefObject. HTMLElement 또는 null을 포함할 수 있습니다.
 * @param options 동작을 미세 조정하기 위한 선택적 설정.
 */
export function usePreventSwipeBack(
  targetRef: RefObject<HTMLElement | null>,
  options?: UsePreventSwipeBackOptions
): void {
  const { edgeThreshold = 30 } = options || {};

  useEffect(() => {
    const element = targetRef.current;
    if (!element) {
      return;
    }

    const handleTouchStart = (event: TouchEvent) => {
      // 단일 터치이고, 화면 왼쪽 가장자리에서 시작하는 경우
      if (event.touches.length === 1 && event.touches[0].clientX < edgeThreshold) {
        event.preventDefault();
      }
    };

    // passive: false 옵션으로 preventDefault 가능하도록 설정
    element.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
    };
  }, [targetRef, edgeThreshold]); // targetRef나 edgeThreshold가 변경되면 effect를 다시 실행
} 