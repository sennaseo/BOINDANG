"use client";

import React from "react";
import ReportTabNav from "@/components/navigation/ReportTabNav";
import { CaretLeft } from "@phosphor-icons/react";
import CompositionChart from "@/components/chart/CompositionChart";

const exampleData = [
  { 
    id: "탄수화물", 
    label: "탄수화물", 
    value: 33, 
    color: "#3b82f6",
    subData: [
      { id: "당류", label: "당류", value: 15, color: "#60a5fa" },
      { id: "식이섬유", label: "식이섬유", value: 8, color: "#93c5fd" },
      { id: "기타", label: "기타", value: 10, color: "#bfdbfe" }
    ]
  },
  { 
    id: "단백질", 
    label: "단백질", 
    value: 5, 
    color: "#22c55e",
    subData: [
      { id: "동물성", label: "동물성", value: 3, color: "#4ade80" },
      { id: "식물성", label: "식물성", value: 2, color: "#86efac" }
    ]
  },
  { 
    id: "지방", 
    label: "지방", 
    value: 14, 
    color: "#f59e42",
    subData: [
      { id: "포화지방", label: "포화지방", value: 6, color: "#fbbf24" },
      { id: "불포화지방", label: "불포화지방", value: 8, color: "#fcd34d" }
    ]
  }
];

export default function CompositionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* 헤더 */}
      <header className="flex items-center mb-2">
        <button className="mr-2 text-2xl"><CaretLeft/></button>
        <h1 className="text-2xl font-bold mx-auto">리포트</h1>
      </header>
      <ReportTabNav />

      {/* 성분 비율 분석표 */}
      <section className="mb-6">
        <h2 className="font-bold text-lg mb-2">성분 비율 분석표</h2>
        <CompositionChart data={exampleData} />
      </section>

      {/* 영양소 성분 구성 */}
      <section className="mb-4">
        <h2 className="font-bold text-lg mb-2">영양소 성분 구성</h2>
        <div className="flex gap-2 mb-2">
          <button className="flex-1 bg-blue-50 text-blue-500 rounded-xl py-2 font-semibold">탄수화물</button>
          <button className="flex-1 bg-green-50 text-green-500 rounded-xl py-2 font-semibold">단백질</button>
          <button className="flex-1 bg-orange-50 text-orange-500 rounded-xl py-2 font-semibold">지방</button>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex gap-2 mb-2 text-sm">
            <button className="text-blue-500 font-bold border-b-2 border-blue-500">당류</button>
            <button className="text-gray-400">식이섬유</button>
            <button className="text-gray-400">기타</button>
          </div>
          <div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>말티톨</span>
              <span className="text-yellow-500 font-bold flex items-center gap-1">▲ 주의</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>말토덱스트린</span>
              <span className="text-red-500 font-bold flex items-center gap-1">▲ 높음</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>폴리글리시톨시럽</span>
              <span className="text-yellow-500 font-bold flex items-center gap-1">▲ 주의</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
