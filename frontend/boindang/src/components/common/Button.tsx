import React from 'react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isDisabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  isDisabled = false,
  fullWidth = true,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  // 버튼 스타일 설정
  const baseStyle = 'rounded-md flex justify-center items-center transition-colors';

  // 너비 설정
  const widthStyle = fullWidth ? 'w-full' : '';

  // 크기 설정
  const sizeStyles = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4',
    lg: 'py-4 px-6 text-lg',
  };

  // 색상 설정
  const variantStyles = {
    primary: isDisabled
      ? 'bg-[#A5ADB8] text-white cursor-not-allowed'
      : 'bg-[#6C2FF2] text-white hover:bg-[#5926c9] active:bg-[#4d1fb0]',
    secondary: isDisabled
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300',
    tertiary: isDisabled
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-[#6C2FF2] hover:text-[#5926c9] active:text-[#4d1fb0]',
  };

  const buttonStyle = `${baseStyle} ${widthStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button
      className={buttonStyle}
      disabled={isDisabled}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button; 