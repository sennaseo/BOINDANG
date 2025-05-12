"use client";

import React from "react";
import ReportTabNav from "@/components/navigation/ReportTabNav";
import { CaretLeft } from "@phosphor-icons/react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* 헤더 */}
      <header className="flex items-center mb-2">
        <button className="mr-2 text-2xl"><CaretLeft/></button>
        <h1 className="text-2xl font-bold mx-auto">리포트</h1>
      </header>
      <ReportTabNav />

      {/* 종합 혈당 지수 측정 */}
      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">종합 혈당 지수 측정</h2>
        <p className="text-gray-400 text-sm mb-3">
          식품에 포함되어있는 성분들의 혈당 지수를 기반으로 통합 등급을 지정하였습니다.
        </p>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="text-gray-500 text-sm mr-2">예상 GI(혈당) 지수</div>
            <div className="text-2xl font-bold text-red-500">58</div>
            <div className="ml-4 text-sm">
              이 제품은 혈당 지수를 <span className="text-red-500 font-bold">위험 수준</span>으로<br />
              증가시킬 수 있어요. 주의가 필요합니다.
            </div>
          </div>
          {/* 게이지 그래프 */}
          <div className="flex flex-col items-center">
            <svg width="180" height="90">
              <path d="M20,80 A70,70 0 0,1 160,80" fill="none" stroke="#eee" strokeWidth="18" />
              <path d="M20,80 A70,70 0 0,1 90,20" fill="none" stroke="#22c55e" strokeWidth="18" />
              <path d="M90,20 A70,70 0 0,1 130,40" fill="none" stroke="#eab308" strokeWidth="18" />
              <path d="M130,40 A70,70 0 0,1 160,80" fill="none" stroke="#ef4444" strokeWidth="18" />
              {/* 바늘 */}
              <line x1="90" y1="80" x2="140" y2="45" stroke="#222" strokeWidth="4" />
              <circle cx="90" cy="80" r="7" fill="#222" />
            </svg>
            <div className="flex justify-between w-full px-4 mt-2 text-xs">
              <span className="text-green-500 font-bold">안전 등급</span>
              <span className="text-yellow-500 font-bold">주의 등급</span>
              <span className="text-red-500 font-bold">위험 등급</span>
            </div>
          </div>
        </div>
      </section>

      {/* 영양 성분 등급 안내 */}
      <section>
        <h2 className="font-bold text-lg mb-2">영양 성분 등급 안내</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center bg-white rounded-xl shadow p-3 border border-yellow-400">
            <span className="text-yellow-500 text-2xl mr-2">🧑‍🎓</span>
            <div>
              <div className="font-semibold">탄수화물</div>
              <div className="text-yellow-500 text-sm">보통</div>
            </div>
          </div>
          <div className="flex items-center bg-white rounded-xl shadow p-3 border border-red-400">
            <span className="text-red-500 text-2xl mr-2">❤️</span>
            <div>
              <div className="font-semibold">당류</div>
              <div className="text-red-500 text-sm font-bold">위험!!</div>
            </div>
          </div>
          <div className="flex items-center bg-white rounded-xl shadow p-3 border border-yellow-400">
            <span className="text-yellow-500 text-2xl mr-2">🧑‍🎓</span>
            <div>
              <div className="font-semibold">지방</div>
              <div className="text-yellow-500 text-sm">보통</div>
            </div>
          </div>
          <div className="flex items-center bg-white rounded-xl shadow p-3 border border-green-400">
            <span className="text-green-500 text-2xl mr-2">🌲</span>
            <div>
              <div className="font-semibold">단백질</div>
              <div className="text-green-500 text-sm">양호</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}