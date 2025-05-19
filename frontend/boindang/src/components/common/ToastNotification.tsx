import React from 'react';
import { Info, CheckCircle, XCircle, Spinner, X, CaretRight } from '@phosphor-icons/react';

interface ToastNotificationProps {
  message: string;
  type: 'info' | 'success' | 'error' | 'loading';
  onClose?: () => void;
  actionButton?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type, onClose, actionButton }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} weight="fill" className="text-green-500 flex-shrink-0" />;
      case 'error':
        return <XCircle size={24} weight="fill" className="text-red-500 flex-shrink-0" />;
      case 'loading':
        return <Spinner size={24} className="animate-spin text-[var(--color-maincolor)] flex-shrink-0" />;
      case 'info':
      default:
        return <Info size={24} weight="fill" className="text-blue-500 flex-shrink-0" />;
    }
  };

  // 너비 조정: w-11/12 (화면 너비의 약 91%) sm 브레이크포인트에서는 max-w-lg (576px)로 제한
  const baseStyle = "fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-11/12 sm:max-w-lg p-4 rounded-xl shadow-2xl flex items-start space-x-3 transition-all duration-300 ease-in-out";
  const typeStyles = {
    info: 'bg-blue-50 border-blue-400 text-blue-700',
    success: 'bg-green-50 border-green-400 text-green-700',
    error: 'bg-red-50 border-red-400 text-red-700',
    loading: 'bg-gray-50 border-gray-400 text-gray-700',
  };

  return (
    <div
      className={`${baseStyle} ${typeStyles[type]} border-l-4`}
      role="alert"
    >
      <div className="mt-0.5"> {/* 아이콘 정렬을 위해 약간의 상단 마진 */}
        {getIcon()}
      </div>
      <div className="flex-grow flex flex-col"> {/* 메시지와 버튼을 수직 정렬 */}
        <p className="text-sm font-medium">{message}</p>
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className={`mt-2 flex items-center self-start text-xs font-semibold ${type === 'error' ? 'text-red-600 hover:text-red-700 active:text-red-800' :
              type === 'success' ? 'text-[var(--color-maincolor)] hover:text-[var(--color-maincolor-100)] active:text-[var(--color-maincolor-200)]' :
                'text-blue-600 hover:text-blue-700 active:text-blue-800'
              } transition-colors duration-150 ease-in-out focus:outline-none focus-visible:underline`}
          >
            {actionButton.text}
            {actionButton.icon || <CaretRight size={16} weight="bold" className="ml-0.5" />}
          </button>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`self-start ml-2 -mr-1 -my-1 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-opacity-20 focus:ring-2 focus:ring-offset-1 ${typeStyles[type].startsWith('bg-blue') ? 'hover:bg-blue-100 focus:ring-blue-300' : typeStyles[type].startsWith('bg-green') ? 'hover:bg-green-100 focus:ring-green-300' : typeStyles[type].startsWith('bg-red') ? 'hover:bg-red-100 focus:ring-red-300' : 'hover:bg-gray-100 focus:ring-gray-300'}`}
          aria-label="Close"
        >
          <span className="sr-only">닫기</span>
          <X size={18} weight="bold" />
        </button>
      )}
    </div>
  );
};

export default ToastNotification; 