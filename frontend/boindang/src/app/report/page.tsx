"use client";

import React from "react";
import BottomNavBar from "@/components/navigation/BottomNavBar";
import { CaretLeft } from "@phosphor-icons/react";
import Image from "next/image";
export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 mb-16">
      {/* 헤더 */}
      <header className="flex items-center mb-4">
        <button className="mr-2 text-2xl"><CaretLeft/></button>
        <h1 className="text-2xl font-bold mx-auto">분석 결과</h1>
      </header>

      {/* 제품 이미지 */}
      <div className="flex justify-center mb-4">
        <Image
          src="/assets/report/cream-latte.jpg" // 실제 이미지 경로로 교체
          alt="제품 사진"
          className="w-80 h-48 object-cover rounded-lg border"
          width={320}
          height={192}
        />
      </div>

      {/* 식품 정보 */}
      <section className="mb-4">
        <h2 className="font-bold text-lg mb-2">식품 정보</h2>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold">스테비아 단백질 옥수수 크림 라떼</div>
          <div className="text-gray-500 text-sm">360g(18g*20개입) | 300 kcal</div>
        </div>
      </section>

      {/* 통합 GI 지수 & 탄단지 비율 */}
      <section className="flex gap-2 mb-4">
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="font-semibold mb-2">통합 GI 지수</div>
          {/* 원형 그래프는 SVG로 대체 */}
          <svg width="60" height="60">
            <circle cx="30" cy="30" r="25" fill="none" stroke="#eee" strokeWidth="8" />
            <circle cx="30" cy="30" r="25" fill="none" stroke="#e53e3e" strokeWidth="8" strokeDasharray="120 40" strokeDashoffset="10" />
          </svg>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="text-green-500">● 안전</span>
            <span className="text-yellow-500">● 주의</span>
            <span className="text-red-500">● 위험</span>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="font-semibold mb-2">탄단지 비율</div>
          {/* 파이차트는 SVG로 대체 */}
          <svg width="60" height="60">
            <circle cx="30" cy="30" r="25" fill="#a78bfa" stroke="white" strokeWidth="2" />
            <path d="M30 30 L30 5 A25 25 0 0 1 55 30 Z" fill="#818cf8" />
            <path d="M30 30 L55 30 A25 25 0 0 1 30 55 Z" fill="#38bdf8" />
          </svg>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="text-purple-500">● 탄수화물</span>
            <span className="text-blue-500">● 단백질</span>
            <span className="text-sky-400">● 지방</span>
          </div>
        </div>
      </section>

      {/* 주의 사항 */}
      <section className="mb-4">
        <h2 className="font-bold text-lg mb-2">주의 사항</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-2">
            <span className="text-red-500 text-2xl">❤️</span>
            <div>
              <div className="font-semibold">혈당 주의 성분</div>
              <div className="text-sm text-red-500">2개</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-2">
            <span className="text-yellow-700 text-2xl">🦴</span>
            <div>
              <div className="font-semibold">포화지방</div>
              <div className="text-sm text-yellow-700">주의</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-2">
            <span className="text-yellow-600 text-2xl">⭐</span>
            <div>
              <div className="font-semibold">콜레스테롤</div>
              <div className="text-sm text-yellow-600">주의</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-2">
            <span className="text-orange-700 text-2xl">🎃</span>
            <div>
              <div className="font-semibold">나트륨</div>
              <div className="text-sm text-orange-700">주의</div>
            </div>
          </div>
        </div>
      </section>

      {/* 버튼 */}
      <div className="flex flex-col gap-2 mt-6">
        <button className="bg-violet-600 text-white rounded-xl py-3 font-bold">식품 상세 리포트 보러가기</button>
        <button className="bg-gray-300 text-gray-500 rounded-xl py-3 font-bold" disabled>분석 결과 저장하기</button>
      </div>

      {/* 하단 네비게이션 */}
        <BottomNavBar/>
    </div>
  );
}
