'use client';

import React, { useState, use, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@/types/api/ingredients';

// Import custom hook
import useIngredientDetail from '@/hooks/useIngredientDetail';

const TAB_NAMES = ['개요', '건강 영향', '사용자별', '더보기']; // Define tab names as a constant

export default function IngredientDetailPage({ params: paramsPromise }: { params: Promise<{ ingredientName: string }> }) {
  const [activeTab, setActiveTab] = useState(TAB_NAMES[0]); // Initialize with the first tab name
  const router = useRouter();
  const params = use(paramsPromise);
  const { ingredientName } = params;
  const { ingredientDetail, isLoading, error, refetch } = useIngredientDetail(ingredientName);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    // ingredientDetail이 로드되고, tabRefs가 설정된 후에만 실행
    if (ingredientDetail && tabRefs.current.length === TAB_NAMES.length) {
      const activeTabIndex = TAB_NAMES.indexOf(activeTab);
      const activeTabButton = tabRefs.current[activeTabIndex];

      if (activeTabButton) {
        setIndicatorStyle({
          left: `${activeTabButton.offsetLeft}px`,
          width: `${activeTabButton.offsetWidth}px`,
        });
      }
    }
  }, [activeTab, ingredientDetail]); // TAB_NAMES is constant, so not strictly needed in deps, but ESLint might prefer it. For now, keep it minimal and correct.
  // If ESLint complains, add TAB_NAMES or memoize it if it were dynamic.

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Spinner size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="text-slate-600">성분 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <header className="sticky top-0 z-40 bg-white p-4 flex items-center border-b border-slate-200 gap-x-3 w-full max-w-md mb-4">
          <button onClick={() => router.push('/ingredients')} className="p-1">
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

  if (!ingredientDetail) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <WarningCircle size={48} className="text-yellow-500 mb-4" />
        <p className="text-slate-600">성분 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

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
    }
  };

  const safetyAppearance = getSafetyLevelAppearance(ingredientDetail.riskLevel);
  // displayData can still exist for other properties, or tabs property can point to TAB_NAMES
  const displayData = {
    name: ingredientDetail.name,
    type: `${ingredientDetail.category} - ${ingredientDetail.type}`,
    safetyLevel: ingredientDetail.riskLevel,
    stats: [
      { icon: <ChartBar size={32} className="text-purple-500 mb-1" />, value: ingredientDetail.gi.toString(), label: '혈당 지수 (GI)' },
      { icon: <Fire size={32} className="text-orange-500 mb-1" />, value: ingredientDetail.calories.toString(), label: '칼로리 (kcal/g)' },
      { icon: <Cookie size={32} className="text-yellow-600 mb-1" />, value: `설탕 대비 ${ingredientDetail.sweetness}배`, label: '상대 감미도' },
    ],
    // tabs: TAB_NAMES, // No longer strictly needed here if tab rendering uses TAB_NAMES directly
    disclaimer: '본 정보는 참고용이며 전문가의 진단 및 상담을 대체할 수 없습니다. 개인의 건강 상태에 따라 영향이 다를 수 있으므로, 특정 건강 상태나 질환이 있는 경우 의료 전문가와 상담하시기 바랍니다.',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto bg-white shadow-lg pb-[80px]">
        <header className="sticky top-0 z-40 bg-white p-4 flex items-center border-b border-slate-200 gap-x-3">
          <button onClick={() => router.back()} className="p-1">
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
                {stat.label === '상대 감미도' ? (
                  <p className="text-xl font-bold text-slate-800">
                    설탕 대비<br />
                    {ingredientDetail.sweetness}배
                  </p>
                ) : (
                  <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                )}
                <p className="text-sm text-slate-600 mt-1 whitespace-nowrap">{stat.label}</p>
              </div>
            ))}
          </section>

          <nav className="relative flex justify-evenly mb-6 bg-slate-100 p-1 rounded-lg">
            <div
              className="absolute top-1 bottom-1 bg-white shadow rounded-md transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />
            {TAB_NAMES.map((tab, index) => ( // Use TAB_NAMES for mapping buttons
              <button
                key={tab}
                ref={(el) => { tabRefs.current[index] = el; }}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 flex-1 py-2.5 px-4 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 ${activeTab === tab
                  ? 'text-purple-600'
                  : 'text-slate-600 hover:text-slate-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="mt-6 overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${TAB_NAMES.indexOf(activeTab) * 100}%)` }} // Use TAB_NAMES for translateX
            >
              <div className="w-full flex-shrink-0 px-1">
                <OverviewTab
                  description={ingredientDetail.description}
                  examples={ingredientDetail.examples}
                  references={ingredientDetail.references}
                />
              </div>
              <div className="w-full flex-shrink-0 px-1">
                <HealthImpactTab effects={ingredientDetail.healthEffects} />
              </div>
              <div className="w-full flex-shrink-0 px-1">
                <UserSpecificTab considerations={ingredientDetail.userConsiderations} />
              </div>
              <div className="w-full flex-shrink-0 px-1">
                <MoreInfoTab info={ingredientDetail.moreInfo} />
              </div>
            </div>
          </div>

          <footer className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              {displayData.disclaimer} {/* displayData is still used for other things */}
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