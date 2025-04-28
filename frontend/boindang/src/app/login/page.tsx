"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeSlash, X, CaretLeft } from "@phosphor-icons/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClearInput = (field: "username" | "password") => {
    setFormData({
      ...formData,
      [field]: "",
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", formData);
  };

  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* 뒤로가기 버튼 */}
      <div className="self-start mb-10">
        <Link href="/" className="text-2xl">
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
      <form onSubmit={handleSubmit} className="w-full mb-6">
        {/* 입력 필드 컨테이너 - 테두리가 있는 둥근 박스 */}
        <div className="w-full rounded-lg border border-gray-300 overflow-hidden mb-6">
          {/* 아이디 입력 필드 */}
          <div className={`relative ${focusedField === 'username' ? 'bg-[#f8f5ff]' : ''}`}>
            <div className="px-4 pt-2 pb-1 relative">
              <span className={`absolute transition-all duration-200 ${(focusedField === 'username' || formData.username)
                ? 'text-xs text-[#6C2FF2] top-1'
                : 'text-base text-gray-500 top-3'
                }`}>
                아이디
              </span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                className="w-full pt-4 pb-1 focus:outline-none text-black"
                style={{ background: 'transparent' }}
              />
              {formData.username && (
                <button
                  type="button"
                  onClick={() => handleClearInput("username")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* 구분선 - 포커스된 필드에 따라 색상 변경 */}
          <div className={`border-t ${focusedField === 'username' ? 'border-[#6C2FF2]' :
            focusedField === 'password' ? 'border-[#6C2FF2]' :
              'border-gray-300'
            }`}></div>

          {/* 비밀번호 입력 필드 */}
          <div className={`relative ${focusedField === 'password' ? 'bg-[#f8f5ff]' : ''}`}>
            <div className="px-4 pt-2 pb-1 relative">
              <span className={`absolute transition-all duration-200 ${(focusedField === 'password' || formData.password)
                ? 'text-xs text-[#6C2FF2] top-1'
                : 'text-base text-gray-500 top-3'
                }`}>
                비밀번호
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full pt-4 pb-1 focus:outline-none text-black"
                style={{ background: 'transparent' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="mr-2 text-gray-400"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => handleClearInput("password")}
                    className="text-gray-400"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full p-3 rounded-md bg-[#6C2FF2] text-white font-medium"
        >
          로그인
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
