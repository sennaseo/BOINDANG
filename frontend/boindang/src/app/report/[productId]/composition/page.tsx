"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import ReportTabNav from "@/components/navigation/ReportTabNav";
import { CaretLeft, X, Info } from "@phosphor-icons/react";
import CompositionChart from "@/components/chart/CompositionChart";
import { useRouter } from 'next/navigation';
import { getReport } from "@/api/report";
import { ApiError } from "@/types/api";
import { ReportPageProps, ReportResultData } from "@/types/api/report";

// --- 타입 정의 시작 ---
interface CompositionSubDataItem {
  id: string;
  label: string;
  value: number;
  color: string;
}
interface CompositionChartDataItem {
  id: string;
  label: string;
  value: number;
  color: string;
  subData?: CompositionSubDataItem[];
}

interface AdditiveItem {
  id: string;
  name: string;
  description: string;
}
interface AdditiveCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  items: AdditiveItem[];
}
// --- 타입 정의 끝 ---

const additiveCategoryStyles: { [key: string]: { icon: string; color: string } } = {
  "감미료": { icon: "🍯", color: "#3b82f6" },
  "산도조절제": { icon: "🧪", color: "#22c55e" },
  "유화제": { icon: "🔄", color: "#f59e42" },
  "점질제": { icon: "🍮", color: "#a855f7" },
  "착향료": { icon: "🌸", color: "#ec4899" },
  "착색료": { icon: "🎨", color: "#ef4444" },
  "보존제": { icon: "🧊", color: "#6366f1" },
  "산화방지제": { icon: "🛡️", color: "#0ea5e9" },
  "팽창제": { icon: "🍞", color: "#14b8a6" },
  "염류": { icon: "🧂", color: "#64748b" },
  "보충제": { icon: "💊", color: "#8b5cf6" },
  "기타": { icon: "🔍", color: "#d97706" },
  "default": { icon: "❓", color: "#777777" }
};

// Helper to slugify names for IDs
const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

export default function CompositionPage({ params: paramsPromise }: ReportPageProps) {
  const params = use(paramsPromise);
  const { productId } = params;
  const router = useRouter();

  const [reportData, setReportData] = useState<ReportResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdditiveItem | null>(null);

  useEffect(() => {
    console.log("productId:", productId);
    if (productId) {
      const fetchReport = async () => {
        try {
          setLoading(true);
          try {
            const response = await getReport(productId);
            const apiResponse = response.data;

            if (apiResponse && apiResponse.success) {
              setReportData(apiResponse.data);
              setLoading(false);
              return; // API 호출 성공 시 리턴
            } else {
              console.warn("API 호출 실패");
            }
          } catch (apiError) {
            console.error("API 호출 오류 발생", apiError);
            // API 오류 시 localStorage 확인으로 넘어감
          }
        } catch (error) {
          console.error("오류 발생:", error);
          setError({ message: "리포트를 불러오는 데 실패했습니다" } as ApiError);
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [productId]);

  const compositionChartData = useMemo((): CompositionChartDataItem[] => {
    if (!reportData?.nutrientDetails) return [];

    const details = reportData.nutrientDetails;
    const findNutrient = (name: string) => details.find(d => d.name === name);

    const mainNutrientsConfig = [
      { name: "탄수화물", color: "#3b82f6", sub: [{name: "당류", color: "#60a5fa"}, {name: "식이섬유", color: "#93c5fd"}] },
      { name: "단백질", color: "#22c55e", sub: [] }, // API에 단백질 하위 상세가 없으면 빈 배열
      { name: "지방", color: "#f59e42", sub: [{name: "포화지방", color: "#fbbf24"}, {name: "트랜스지방", color: "#fcd34d"}] },
    ];

    return mainNutrientsConfig.map(mainNutrient => {
      const mainDetail = findNutrient(mainNutrient.name);
      if (!mainDetail) return null; // 해당 주 영양소가 없으면 skip

      let subData: CompositionSubDataItem[] | undefined = [];
      let accountedSubValue = 0;

      // 하위 성분이 없는 경우(sub 배열이 비어있는 경우), 주요 성분 자체를 내측 그래프에 100%로 표시
      if (mainNutrient.sub.length === 0) {
        subData.push({
          id: slugify(mainDetail.name),
          label: mainDetail.name,
          value: mainDetail.value,
          color: mainNutrient.color,
        });
      } else {
        // 하위 성분이 있는 경우 기존 로직대로 처리
        mainNutrient.sub.forEach(subNutrientInfo => {
          const subDetail = findNutrient(subNutrientInfo.name);
          if (subDetail && subDetail.value > 0) {
            subData!.push({
              id: slugify(subDetail.name),
              label: subDetail.name,
              value: subDetail.value,
              color: subNutrientInfo.color,
            });
            accountedSubValue += subDetail.value;
          }
        });
        
        // "기타" 항목 추가 (주요 영양소 값에서 하위 항목 값들을 뺀 나머지)
        const otherValue = mainDetail.value - accountedSubValue;
        if (otherValue > 0.1 && mainNutrient.sub.length > 0) { // 유의미한 값일 때만 "기타" 추가
          subData!.push({
            id: slugify(`기타 ${mainNutrient.name}`),
            label: "기타",
            value: parseFloat(otherValue.toFixed(1)), // 소수점 한자리
            color: "#bfdbfe", // 기타 색상
          });
        }
      }

      // subData가 비어있다면 undefined로 설정하여 차트에서 올바르게 처리되도록 함
      if (subData?.length === 0) subData = undefined;

      return {
        id: slugify(mainDetail.name),
        label: mainDetail.name,
        value: mainDetail.value,
        color: mainNutrient.color,
        subData: subData && subData.length > 0 ? subData : undefined,
      };
    }).filter(item => item !== null) as CompositionChartDataItem[];
  }, [reportData]);

    const additiveCategoriesData = useMemo((): AdditiveCategory[] => {
      if (!reportData?.categorizedIngredients) return [];
      
      const categorized = reportData.categorizedIngredients;
      return Object.keys(categorized).map(categoryName => {
        const style = additiveCategoryStyles[categoryName] || additiveCategoryStyles.default;
        const items: AdditiveItem[] = categorized[categoryName].map((item, index) => ({
          id: slugify(`${categoryName}-${item.name}-${index}`),
          name: item.name,
          description: item.description?.join(' ') || '설명 없음',
        }));

        return {
          id: slugify(categoryName),
          name: categoryName,
          ...style,
          items,
        };
      });
    }, [reportData]);

  // 선택된 카테고리 데이터 가져오기
  const selectedCategoryModalData = selectedCategory 
    ? additiveCategoriesData.find(cat => cat.id === selectedCategory) 
    : null;

  // 카테고리 버튼 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowModal(true);
    setSelectedItem(null);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // 아이템 클릭 핸들러
  const handleItemClick = (item: AdditiveItem) => {
    setSelectedItem(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-700">리포트 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
        <p className="text-xl font-semibold text-red-500 mb-4">오류 발생</p>
        <p className="text-gray-700 mb-6 text-center">{error.message}</p>
        <button 
          onClick={() => router.push('/')} 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }
  
  if (!reportData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
        <p className="text-xl font-semibold text-gray-700 mb-4">리포트 정보를 찾을 수 없습니다.</p>
        {productId && <p className="text-sm text-gray-500 mb-6">해당 ID({productId})의 리포트가 존재하지 않거나, 데이터를 불러오는 데 문제가 발생했습니다.</p>}
        <button 
          onClick={() => router.push('/')} 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-10">
      {/* 헤더 */}
      <header className="flex items-center mb-2">
        <button onClick={() => router.push(`/report/${productId}`)} className="mr-2 text-2xl"><CaretLeft/></button>
        <h1 className="text-2xl font-bold mx-auto">리포트 ({reportData.productName || "제품"})</h1>
      </header>
      <ReportTabNav productId={productId} />

      {/* 성분 비율 분석표 */}
      <section className="mb-6">
        <h2 className="font-bold text-lg mb-2">성분 비율 분석표 (단위: g 또는 mg)</h2>
        {compositionChartData.length > 0 ? (
            <CompositionChart data={compositionChartData} />
        ) : (
            <p className="text-gray-500 text-center py-4">성분 비율 데이터가 없습니다.</p>
        )}
      </section>

      {/* 영양소 성분 구성 */}
      <section className="mb-4">
        <h2 className="font-bold text-lg mb-2">첨가물 성분 구성</h2>
        {additiveCategoriesData.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
            {additiveCategoriesData.map((category) => (
                <button
                key={category.id}
                onClick={() => category.items.length > 0 ? handleCategoryClick(category.id) : null}
                className={`bg-white rounded-xl shadow p-4 transition-all flex flex-col items-center justify-center aspect-square ${
                  category.items.length > 0 
                    ? "hover:shadow-md hover:scale-105 cursor-pointer" 
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={category.items.length === 0}
                >
                <div 
                    className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center text-2xl ${
                      category.items.length === 0 ? "bg-gray-200" : ""
                    }`}
                    style={{ 
                      backgroundColor: category.items.length > 0 
                        ? `${category.color}20` 
                        : "#e5e7eb" 
                    }}
                >
                    {category.icon}
                </div>
                <p className={`font-semibold text-sm text-center ${
                  category.items.length > 0 ? "text-gray-600" : "text-gray-400"
                }`}>
                  {category.name}
                  {category.items.length === 0 && <span className="block text-xs mt-1">(없음)</span>}
                </p>
                </button>
            ))}
            </div>
        ) : (
            <p className="text-gray-500 text-center py-4">첨가물 정보가 없습니다.</p>
        )}
      </section>

      {/* 모달 */}
      {showModal && selectedCategoryModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            {/* 모달 헤더 */}
            <div className="p-4 flex justify-between items-center border-b" style={{ backgroundColor: `${selectedCategoryModalData.color}20` }}>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{selectedCategoryModalData.icon}</span>
                <h3 className="text-xl font-bold">{selectedCategoryModalData.name}</h3>
              </div>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            {/* 모달 내용 */}
            <div className="flex-1 overflow-y-auto">
              {!selectedItem && (
                <ul className="divide-y">
                  {selectedCategoryModalData.items.map((item) => (
                    <li key={item.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleItemClick(item)}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <Info size={20} className="text-gray-400" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {selectedItem && (
                <div className="p-4">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="mb-4 text-blue-500 flex items-center text-sm"
                  >
                    <CaretLeft size={16} />
                    <span className="ml-1">목록으로 돌아가기</span>
                  </button>
                  <h4 className="text-lg font-bold mb-2">{selectedItem.name}</h4>
                  <p className="text-gray-700 text-sm">{selectedItem.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
