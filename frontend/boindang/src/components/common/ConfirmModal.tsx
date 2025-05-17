'use client';

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string; // 기본값 '확인'
  cancelText?: string; // 기본값 '취소'
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
}) => {
  if (!isOpen) return null;

  // 모달 외부 클릭 시 닫기 (이벤트 버블링 방지 포함)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4" // 배경 관련 Tailwind 클래스 제거
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} // 인라인 스타일로 RGBA 배경색 지정 (검은색, 30% 불투명도)
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          {title && <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>}
          <p className="text-base text-gray-900 whitespace-pre-line text-center">{message}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 px-6 py-4 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full px-4 py-3 rounded-md text-sm font-medium text-white bg-[#6C2FF2] hover:bg-[#5926c9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C2FF2] transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;