import React from 'react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string; // 기본값 '확인'
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = '확인',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 rounded-md text-sm font-medium text-white bg-[#6C2FF2] hover:bg-[#5926c9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C2FF2] transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal; 