'use client';

import React, { useState, use } from 'react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import { ArrowLeft, WarningCircle, ChartBar, Fire, Cookie, CheckCircle, XCircle, Spinner } from '@phosphor-icons/react';

// Import Tab Components
import OverviewTab from './OverviewTab';
import HealthImpactTab from './HealthImpactTab';
import UserSpecificTab from './UserSpecificTab';
import MoreInfoTab from './MoreInfoTab';

// Import API Types and Processed Types from the centralized file
import type {
  ProcessedIngredientDetail,
  // OverviewTabProps, // 사용 안 함
  // HealthImpactTabProps, // 사용 안 함
  // UserSpecificTabProps, // 사용 안 함
  // MoreInfoTabProps // 사용 안 함
} from '@/types/api/ingredients';

// Import custom hook
import useIngredientDetail from '@/hooks/useIngredientDetail';

export default function IngredientDetailPage({ params: paramsPromise }: { params: Promise<{ ingredientName: string }> }) {
  const [activeTab, setActiveTab] = useState('개요');

  const params = use(paramsPromise);
  const { ingredientName } = params;

  const { ingredientDetail, isLoading, error, refetch } = useIngredientDetail(ingredientName);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Spinner size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="text-slate-600">성분 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 오류 발생 UI
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <header className="sticky top-0 z-40 bg-white p-4 flex items-center border-b border-slate-200 gap-x-3 w-full max-w-md mb-4">
          <button onClick={() => window.history.back()} className="p-1">
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">오류</h1>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-md">
          <WarningCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">데이터를 불러오는데 실패했습니다.</p>
          <p className="text-sm text-slate-600">오류 메시지: {error}</p>
          <button
            onClick={() => refetch()}
            className="mt-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터 로드 실패 또는 데이터가 없는 경우 (ingredientDetail이 null인 경우)
  if (!ingredientDetail) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <WarningCircle size={48} className="text-yellow-500 mb-4" />
        <p className="text-slate-600">성분 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 이하 코드는 ingredientDetail이 존재함을 보장받고 진행
  // safetyLevel에 따른 아이콘 및 스타일 반환 함수 (Props 타입을 ProcessedIngredientDetail로 변경)
  const getSafetyLevelAppearance = (level: ProcessedIngredientDetail['riskLevel']) => {
    switch (level) {
      case '안심':
        return {
          icon: <CheckCircle size={20} className="mr-1.5 flex-shrink-0" weight="bold" />,
          className: 'bg-green-100 text-green-700 border-green-200',
        };
      case '주의':
        return {
          icon: <WarningCircle size={20} className="mr-1.5 flex-shrink-0" weight="bold" />,
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
      case '위험':
        return {
          icon: <XCircle size={20} className="mr-1.5 flex-shrink-0" weight="bold" />,
          className: 'bg-red-100 text-red-700 border-red-200',
        };
      // default는 ProcessedIngredientDetail의 riskLevel 타입에 의해 발생하지 않아야 함
    }
  };

  const safetyAppearance = getSafetyLevelAppearance(ingredientDetail.riskLevel);

  // 최종적으로 UI에 사용될 데이터 (ProcessedIngredientDetail 기반)
  const displayData = {
    name: ingredientDetail.name,
    type: `${ingredientDetail.category} - ${ingredientDetail.type}`,
    safetyLevel: ingredientDetail.riskLevel,
    stats: [
      { icon: <ChartBar size={32} className="text-purple-500 mb-1" />, value: ingredientDetail.gi.toString(), label: '혈당 지수 (GI)' },
      { icon: <Fire size={32} className="text-orange-500 mb-1" />, value: ingredientDetail.calories.toString(), label: '칼로리 (kcal/g)' },
      { icon: <Cookie size={32} className="text-yellow-600 mb-1" />, value: `설탕 대비 ${ingredientDetail.sweetness}배`, label: '상대 감미도' },
    ],
    tabs: ['개요', '건강 영향', '사용자별', '더보기'],
    disclaimer: '본 정보는 참고용이며 전문가의 진단 및 상담을 대체할 수 없습니다. 개인의 건강 상태에 따라 영향이 다를 수 있으므로, 특정 건강 상태나 질환이 있는 경우 의료 전문가와 상담하시기 바랍니다.',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto bg-white shadow-lg pb-[80px]">
        <header className="sticky top-0 z-40 bg-white p-4 flex items-center border-b border-slate-200 gap-x-3">
          <button onClick={() => window.history.back()} className="p-1">
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">{displayData.name} {ingredientDetail.engName ? `(${ingredientDetail.engName})` : ''}</h1>
        </header>

        <main className="p-4">
          <section className="mb-6 p-4 border border-slate-200 rounded-lg bg-white">
            <p className="text-lg font-semibold text-slate-800 mb-2">{displayData.type}</p>
            {displayData.safetyLevel && (
              <div className="mt-3">
                <div className={`inline-flex items-center text-sm font-bold px-3 py-1.5 rounded-full border ${safetyAppearance.className}`}>
                  {safetyAppearance.icon}
                  {displayData.safetyLevel}
                </div>
              </div>
            )}
          </section>

          <section className="grid grid-cols-3 gap-4 mb-8">
            {displayData.stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center border border-slate-100">
                <div className="mb-2">{stat.icon}</div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-600 mt-1 whitespace-nowrap">{stat.label}</p>
              </div>
            ))}
          </section>

          <nav className="flex justify-evenly mb-6 bg-slate-100 p-1 rounded-lg">
            {displayData.tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 ${activeTab === tab
                  ? 'bg-white shadow text-purple-600'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="mt-6">
            {activeTab === '개요' &&
              <OverviewTab
                description={ingredientDetail.description}
                examples={ingredientDetail.examples}
                references={ingredientDetail.references}
              />}
            {activeTab === '건강 영향' && <HealthImpactTab effects={ingredientDetail.healthEffects} />}
            {activeTab === '사용자별' && <UserSpecificTab considerations={ingredientDetail.userConsiderations} />}
            {activeTab === '더보기' && <MoreInfoTab info={ingredientDetail.moreInfo} />}
          </div>

          <footer className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              {displayData.disclaimer}
            </p>
          </footer>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto border-t border-slate-200">
        <BottomNavBar />
      </div>
    </div>
  );
}

// Helper interfaces for Tab props -> 삭제 (위에서 import)
// export interface HealthImpactTabProps { ... } -> 삭제
// export interface UserSpecificTabProps { ... } -> 삭제
// export interface MoreInfoTabProps { ... } -> 삭제
// OverviewTabProps가 page.tsx 내에 있었다면 그것도 삭제 대상

// activeTab === '개요' 부분에서 OverviewTab에 전달하는 props가 OverviewTabProps 타입과 일치하는지 확인 필요
// 예: <OverviewTab description={ingredientDetail.description} examples={ingredientDetail.examples} references={ingredientDetail.references} />
// ProcessedIngredientDetail의 정의와 OverviewTabProps의 정의가 일치해야 함.

// ... (나머지 코드) ... 