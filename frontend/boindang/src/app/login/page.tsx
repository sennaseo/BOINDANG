"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Eye, EyeSlash, X, CaretLeft } from "@phosphor-icons/react";

// 타입 정의
interface LoginFormData {
  username: string;
  password: string;
}

interface InputFieldProps {
  id: string;
  name: keyof LoginFormData;
  label: string;
  type: string;
  value: string;
  showPassword?: boolean;
  focusedField: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: (fieldName: string) => void;
  onBlur: () => void;
  onClear: (field: keyof LoginFormData) => void;
  onTogglePassword?: () => void;
  isPassword?: boolean;
}

// 입력 필드 컴포넌트
const InputField = ({
  id,
  name,
  label,
  type,
  value,
  showPassword,
  focusedField,
  onChange,
  onFocus,
  onBlur,
  onClear,
  onTogglePassword,
  isPassword = false,
}: InputFieldProps) => {
  const isFocused = focusedField === name;
  const hasValue = value !== "";

  return (
    <div className={`relative ${isFocused ? "bg-[#f8f5ff]" : ""}`}>
      <div className="px-4 pt-2 pb-1 relative">
        <span
          className={`absolute transition-all duration-200 ${isFocused || hasValue
            ? "text-xs text-[#6C2FF2] top-1"
            : "text-base text-gray-500 top-3"
            }`}
        >
          {label}
        </span>
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => onFocus(name)}
          onBlur={onBlur}
          className="w-full pt-4 pb-1 focus:outline-none text-black"
          style={{ background: "transparent" }}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
          {isPassword && onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="mr-2 text-gray-400"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          )}
          {hasValue && (
            <button
              type="button"
              onClick={() => onClear(name)}
              className="text-gray-400"
              aria-label="입력 지우기"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  // 상태 관리
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 입력 필드 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // 에러 메시지가 있었다면 지우기
    if (error) setError(null);
  };

  // 입력 필드 지우기
  const handleClearInput = (field: keyof LoginFormData) => {
    setFormData({
      ...formData,
      [field]: "",
    });
  };

  // 비밀번호 표시/숨김 토글
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 포커스 핸들러
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  // 블러 핸들러
  const handleBlur = () => {
    setFocusedField(null);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 입력값 검증
    if (!formData.username.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }

    if (!formData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    // API 연동 시 로직
    try {
      setIsLoading(true);
      setError(null);

      // API 통신 코드가 들어갈 위치
      console.log("로그인 시도:", formData);

      // 로그인 성공 시 처리 (주석 처리)
      // router.push('/main');

    } catch (err) {
      // 실제 에러 처리
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      console.error("로그인 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 키보드 이벤트 핸들러 (Enter 키로 제출)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && focusedField) {
        const form = document.getElementById("login-form") as HTMLFormElement;
        if (form) form.requestSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedField]);

  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* 뒤로가기 버튼 */}
      <div className="self-start mb-10">
        <Link href="/onboarding" className="text-2xl" aria-label="홈으로 돌아가기">
          <CaretLeft size={24} weight="bold" />
        </Link>
      </div>

      {/* 로고 */}
      <div className="mb-12">
        <Image
          src="/보인당logo_purple.png"
          alt="보인당 로고"
          width={120}
          height={50}
          priority
        />
      </div>

      {/* 로그인 폼 */}
      <form id="login-form" onSubmit={handleSubmit} className="w-full mb-6">
        {/* 입력 필드 컨테이너 */}
        <div className="w-full rounded-lg border border-gray-300 overflow-hidden mb-6">
          {/* 아이디 입력 필드 */}
          <InputField
            id="username"
            name="username"
            label="아이디"
            type="text"
            value={formData.username}
            focusedField={focusedField}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClear={handleClearInput}
          />

          {/* 구분선 */}
          <div
            className={`border-t ${focusedField === "username" || focusedField === "password"
              ? "border-[#6C2FF2]"
              : "border-gray-300"
              }`}
          ></div>

          {/* 비밀번호 입력 필드 */}
          <InputField
            id="password"
            name="password"
            label="비밀번호"
            type="password"
            value={formData.password}
            showPassword={showPassword}
            focusedField={focusedField}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClear={handleClearInput}
            onTogglePassword={handleTogglePasswordVisibility}
            isPassword={true}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className={`w-full p-3 rounded-md ${isLoading ? "bg-gray-400" : "bg-[#6C2FF2]"
            } text-white font-medium`}
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 회원가입 링크 */}
      <div className="text-sm text-center">
        <span className="text-gray-500">처음이신가요?</span>{" "}
        <Link href="/signup" className="text-[#6C2FF2]">
          회원가입
        </Link>
      </div>
    </div>
  );
}
