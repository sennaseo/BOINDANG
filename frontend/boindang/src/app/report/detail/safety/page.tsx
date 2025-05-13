"use client";

import React, { useState } from "react";
import ReportTabNav from "@/components/navigation/ReportTabNav";
import { CaretLeft, Info } from "@phosphor-icons/react";
import dynamic from "next/dynamic";

// 동적 import, SSR 비활성화
const SafetyChart = dynamic(() => import("@/components/chart/SafetyChart"), {
  ssr: false,
});

// 상태 타입 정의
type StatusType = 'deficiency' | 'recommend' | 'caution' | 'danger';

// 영양 성분 데이터
const nutritionData = [
  { id: 'protein', name: '단백질', value: 75, status: 'recommend' as StatusType, icon: '🥩' },
  { id: 'carbs', name: '탄수화물', value: 65, status: 'caution' as StatusType, icon: '🍚' },
  { id: 'fiber', name: '식이섬유', value: 30, status: 'deficiency' as StatusType, icon: '🌾' },
  { id: 'sugar', name: '당류', value: 90, status: 'danger' as StatusType, icon: '🍬' },
  { id: 'fat', name: '지방', value: 60, status: 'caution' as StatusType, icon: '🧈' },
  { id: 'saturated-fat', name: '포화지방', value: 85, status: 'danger' as StatusType, icon: '🍔' },
  { id: 'trans-fat', name: '트랜스지방', value: 20, status: 'recommend' as StatusType, icon: '🚫' },
  { id: 'sodium', name: '나트륨', value: 75, status: 'caution' as StatusType, icon: '🧂' },
  { id: 'potassium', name: '칼륨', value: 45, status: 'recommend' as StatusType, icon: '🍌' },
  { id: 'phosphorus', name: '인', value: 25, status: 'deficiency' as StatusType, icon: '🦴' },
  { id: 'cholesterol', name: '콜레스테롤', value: 80, status: 'danger' as StatusType, icon: '🥚' },
];

// 등급별 설명 및 스타일
const statusInfo = {
  deficiency: {
    color: 'blue',
    text: '결핍',
    description: '1일 기준치에 비해 현저히 낮은 비율입니다.'
  },
  recommend: {
    color: 'green',
    text: '권장',
    description: '1일 기준치에 적절한 비율입니다.'
  },
  caution: {
    color: 'yellow',
    text: '주의',
    description: '1일 기준치에 비해 다소 낮거나 높아 조절이 필요할 수 있습니다.'
  },
  danger: {
    color: 'red',
    text: '위험',
    description: '1일 기준치에 비해 매우 낮거나 높아 건강에 부정적인 영향을 줄 수 있습니다.'
  }
};

export default function SafetyPage() {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);

  const toggleInfo = (id: string) => {
    if (activeInfo === id) {
      setActiveInfo(null);
    } else {
      setActiveInfo(id);
    }
  };

  // 상태 버튼 클릭 핸들러
  const handleStatusClick = (status: StatusType) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(status);
    }
  };

  // 등급에 따른 테두리 색상 반환
  const getBorderColor = (status: StatusType) => {
    switch(status) {
      case 'deficiency': return 'border-blue-400';
      case 'recommend': return 'border-green-400';
      case 'caution': return 'border-yellow-400';
      case 'danger': return 'border-red-400';
      default: return 'border-gray-400';
    }
  };

  // 등급에 따른 텍스트 색상 반환
  const getTextColor = (status: StatusType) => {
    switch(status) {
      case 'deficiency': return 'text-blue-500';
      case 'recommend': return 'text-green-500';
      case 'caution': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // 등급에 따른 배경색 반환
  const getBgColor = (status: StatusType) => {
    switch(status) {
      case 'deficiency': return 'bg-blue-500';
      case 'recommend': return 'bg-green-500';
      case 'caution': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // 활성 상태에 따른 배경색 반환
  const getActiveBgColor = (status: StatusType) => {
    switch(status) {
      case 'deficiency': return 'bg-blue-100';
      case 'recommend': return 'bg-green-100';
      case 'caution': return 'bg-yellow-100';
      case 'danger': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

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
        <p className="text-gray-400 font-light text-xs mb-3">
          식품에 포함되어있는 성분들의 혈당 지수를 기반으로 통합 등급을 지정하였습니다.
        </p>
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex bg-gray-100 rounded-xl py-2 px-2 items-center mb-2 justify-around">
            <div className="flex flex-col items-center bg-gray-200 rounded-xl px-3">
              <div className="text-gray-500 text-sm mr-2">예상 GI 지수</div>
              <div className="text-2xl font-bold text-red-500">58</div>
            </div>
            <div className="ml-4 text-sm font-light">
              이 제품은 혈당 지수를 <span className="text-red-500 font-bold">위험 수준</span>으로<br />
              증가시킬 수 있어요. 주의가 필요합니다.
            </div>
          </div>
          {/* 게이지 그래프 */}
          <div className="flex flex-col items-center">
            <SafetyChart value={58} />
            <div className="flex justify-between w-full px-4 mt-2 text-xs">
              <span className="text-green-500 font-bold">안전 등급</span>
              <span className="text-yellow-500 font-bold">주의 등급</span>
              <span className="text-red-500 font-bold">위험 등급</span>
            </div>
          </div>
        </div>
      </section>

      {/* 등급 설명 */}
      <section className="mb-6">
        <h2 className="font-bold text-lg mb-2">영양소 등급 기준</h2>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center">
              <button 
                onClick={() => handleStatusClick('deficiency')}
                className={`w-40 h-10 rounded-xl border border-blue-500 text-blue-500 font-bold text-lg flex items-center justify-center transition-all ${selectedStatus === 'deficiency' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
              >
                결핍
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button 
                onClick={() => handleStatusClick('recommend')}
                className={`w-40 h-10 rounded-xl border border-green-500 text-green-500 font-bold text-lg flex items-center justify-center transition-all ${selectedStatus === 'recommend' ? 'bg-green-100' : 'hover:bg-green-50'}`}
              >
                권장
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button 
                onClick={() => handleStatusClick('caution')}
                className={`w-40 h-10 rounded-xl border border-yellow-500 text-yellow-500 font-bold text-lg flex items-center justify-center transition-all ${selectedStatus === 'caution' ? 'bg-yellow-100' : 'hover:bg-yellow-50'}`}
              >
                주의
              </button>
            </div>  
            <div className="flex items-center justify-center">
              <button 
                onClick={() => handleStatusClick('danger')}
                className={`w-40 h-10 rounded-xl border border-red-500 text-red-500 font-bold text-lg flex items-center justify-center transition-all ${selectedStatus === 'danger' ? 'bg-red-100' : 'hover:bg-red-50'}`}
              >
                위험
              </button>
            </div>
          </div>
          
          {/* 선택된 등급 설명 표시 */}
          {selectedStatus && (
            <div className="mt-4 pt-4 border-t">
              <div className={`p-4 rounded-lg ${getActiveBgColor(selectedStatus)}`}>
                <h3 className={`font-bold text-lg mb-2 ${getTextColor(selectedStatus)}`}>
                  {statusInfo[selectedStatus].text}
                </h3>
                <p className="text-gray-700">{statusInfo[selectedStatus].description}</p>
                
                {selectedStatus === 'deficiency' && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      결핍된 영양소의 보충을 위해 균형 잡힌 식단을 유지하고, 필요시 영양 보충제를 고려해볼 수 있습니다. 장기적인 결핍은 건강 문제를 일으킬 수 있으니 주의하세요.
                    </p>
                  </div>
                )}
                
                {selectedStatus === 'recommend' && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      적절한 영양소 섭취로 건강 유지에 도움이 됩니다. 계속해서 균형 잡힌 식단을 유지하시기 바랍니다.
                    </p>
                  </div>
                )}
                
                {selectedStatus === 'caution' && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      일시적으로 문제가 되지 않을 수 있으나, 지속적인 불균형은 장기적인 건강 문제를 일으킬 수 있습니다. 특정 질환이 있는 경우 더 주의가 필요합니다.
                    </p>
                  </div>
                )}
                
                {selectedStatus === 'danger' && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      건강에 즉각적인 영향을 줄 수 있는 수준입니다. 특히 만성 질환이 있는 경우 전문가의 상담을 받아보세요. 식단 조절이 시급히 필요합니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 영양 성분 등급 안내 */}
      <section>
        <h2 className="font-bold text-lg mb-2">영양 성분 등급 안내</h2>
        <div className="grid grid-cols-2 gap-3">
          {nutritionData.map((item) => (
            <div 
              key={item.id}
              className={`bg-white rounded-xl shadow p-3 ${getBorderColor(item.status)} border relative overflow-hidden transition-all duration-300 ${activeInfo === item.id ? 'col-span-2' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${getTextColor(item.status)} bg-${statusInfo[item.status].color}-50 mr-2`}>{item.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{item.name}</div>
                    <div className={`${getTextColor(item.status)} text-sm font-medium`}>
                      {statusInfo[item.status].text}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleInfo(item.id)}
                  className={`${getTextColor(item.status)} hover:opacity-70 transition-opacity`}
                >
                  <Info size={20} weight="bold" />
                </button>
              </div>
              
              {activeInfo === item.id && (
                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                  <p>{statusInfo[item.status].description}</p>
                  <div className="mt-2">
                    <div className="bg-gray-100 h-3 rounded-full mt-2 mb-1 overflow-hidden">
                      <div 
                        className={`h-full ${getBgColor(item.status)} rounded-full transition-all duration-500`} 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span className={`font-medium ${getTextColor(item.status)}`}>권장량 대비 {item.value}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}