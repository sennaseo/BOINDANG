"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { House, ChartLine, Info, Heart } from "@phosphor-icons/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// 탄단지 비율 데이터
const nutritionData = [
  { name: '탄수화물', value: 50, fill: '#8b5cf6' },
  { name: '단백질', value: 30, fill: '#4f46e5' },
  { name: '지방', value: 20, fill: '#0ea5e9' },
];

// GI 지수 값 (0-100)
const giScore = 75;

// GI 지수 게이지 차트 데이터
const giGaugeData = [
  { name: '백분율', value: giScore, color: '#FFFFFF' },
  { name: '남은 비율', value: 100 - giScore, color: 'transparent' }
];

// GI 색상 설정
const giColors = {
  safe: '#22c55e',   // 안전 - 녹색 (0-39)
  caution: '#facc15', // 주의 - 노란색 (40-69)
  danger: '#e53e3e'   // 위험 - 빨간색 (70-100)
};


export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-5 pb-24">
      {/* 헤더 */}
      <header className="flex items-center justify-center mb-6 relative">
        <div className="absolute left-0">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <House size={24} weight="bold" />
          </Link>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800">분석 결과</h1>
      </header>

      {/* 제품 이미지 */}
      <div className="mb-6">
        <div className="relative w-full h-60 rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/assets/report/cream-latte.jpg" // 실제 이미지 경로로 교체
            alt="제품 사진"
            className="object-cover"
            fill
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
            <div className="text-white font-bold text-xl">스테비아 단백질 옥수수 크림 라떼</div>
            <div className="text-white/80 text-sm">360g(18g*20개입) | 300 kcal</div>
          </div>
        </div>
      </div>

      {/* 통합 GI 지수 & 탄단지 비율 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5 transform transition-all hover:shadow-lg">
          <div className="flex items-center mb-4">
            <ChartLine size={22} className="text-violet-600 mr-2" weight="bold" />
            <h2 className="font-bold text-lg text-gray-800">통합 GI 지수</h2>
          </div>
          <div className="flex flex-col items-center">
            {/* Recharts로 구현한 GI 지수 게이지 */}
            <div className="relative" style={{ width: 160, height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* 배경 반원 (회색) */}
                  <Pie
                    data={[{ value: 100 }]}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    fill="#f3f4f6"
                  />
                  
                  {/* 실제 값 반원 (그라데이션 색상) */}
                  <defs>
                    <linearGradient id="giColorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={giColors.safe} />
                      <stop offset="50%" stopColor={giColors.caution} />
                      <stop offset="100%" stopColor={giColors.danger} />
                    </linearGradient>
                  </defs>
                  
                  <Pie
                    data={giGaugeData}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    cornerRadius={5}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    strokeWidth={0}
                  >
                    <Cell fill="url(#giColorGradient)" />
                    <Cell fill="transparent" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* 바늘 */}
              <div 
                className="absolute bottom-0 left-1/2 w-[2px] h-[60px] bg-gray-800 origin-bottom z-10 transition-transform duration-500 ease-out"
                style={{ 
                  transform: `translateX(-50%) rotate(${giScore * 1.8 - 90}deg)`
                }}
              >
                <div className="w-[6px] h-[6px] rounded-full bg-gray-800 absolute -top-[3px] -left-[2px]"></div>
              </div>
              
              {/* 중앙점 */}
              <div className="absolute bottom-0 left-1/2 w-[10px] h-[10px] bg-gray-800 rounded-full transform -translate-x-1/2 z-20"></div>
            </div>
            
            <div className="flex justify-between w-full px-4 mt-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mb-1"></div>
                <span className="text-xs font-medium">안전</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mb-1"></div>
                <span className="text-xs font-medium">주의</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mb-1"></div>
                <span className="text-xs font-medium">위험</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 transform transition-all hover:shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-[22px] h-[22px] rounded-full bg-violet-600 flex items-center justify-center mr-2">
              <div className="w-[12px] h-[12px] rounded-full border-2 border-white"></div>
            </div>
            <h2 className="font-bold text-lg text-gray-800">탄단지 비율</h2>
          </div>
          <div className="flex flex-col items-center">
            <div style={{ width: 120, height: 120 }} className="mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nutritionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={50}
                    paddingAngle={1}
                    dataKey="value"
                    strokeWidth={1}
                    cornerRadius={10}
                    stroke="#fff"
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              {nutritionData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mb-1" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-xs font-medium text-center">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 주의 사항 */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <Info size={22} className="text-violet-600 mr-2" weight="bold" />
          <h2 className="font-bold text-lg text-gray-800">주의 사항</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-red-100 flex items-center gap-3 transform transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <Heart size={20} className="text-red-500" weight="fill" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">혈당 주의 성분</div>
              <div className="text-sm font-bold text-red-500">2개</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-yellow-100 flex items-center gap-3 transform transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-500 text-lg">🦴</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">포화지방</div>
              <div className="text-sm font-bold text-yellow-500">주의</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-yellow-100 flex items-center gap-3 transform transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-500 text-lg">⭐</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">콜레스테롤</div>
              <div className="text-sm font-bold text-yellow-500">주의</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-orange-100 flex items-center gap-3 transform transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-500 text-lg">🎃</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">나트륨</div>
              <div className="text-sm font-bold text-orange-500">주의</div>
            </div>
          </div>
        </div>
      </section>

      {/* 버튼 */}
      <div className="flex flex-col gap-3 mt-8">
        <Link 
          href="/report/detail/safety"
          className="flex items-center justify-center gap-2 bg-violet-600 text-white rounded-xl py-4 font-bold shadow-md shadow-violet-200 transition-all hover:bg-violet-700 active:scale-[0.98]"
        >
          <ChartLine size={18} weight="bold" />
          식품 상세 리포트 보러가기
        </Link>
        <button className="bg-gray-200 text-gray-400 rounded-xl py-4 font-bold" disabled>
          분석 결과 저장하기
        </button>
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 bg-white border border-violet-600 text-violet-600 rounded-xl py-4 font-bold transition-all hover:bg-violet-50 active:scale-[0.98]"
        >
          <House size={18} weight="bold" />
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
