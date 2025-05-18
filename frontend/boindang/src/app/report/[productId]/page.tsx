"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { House, ChartLine, Info, Heart } from "@phosphor-icons/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getReport } from "@/api/report";
import { ApiError, ApiResponse } from "@/types/api";

// GI 색상 설정
const giColors = {
  safe: '#22c55e',   // 안전 - 녹색 (0-39)
  caution: '#facc15', // 주의 - 노란색 (40-69)
  danger: '#e53e3e'   // 위험 - 빨간색 (70-100)
};

// ReportPage Props 타입 정의
type ReportPageProps = {
  params: Promise<{ productId: string }>;
};

// API 응답 내의 타입 정의
interface NutrientRatio {
  name: string;
  percent: number;
}

interface NutrientDetail {
  name: string;
  value: number;
  percent: number;
  grade: string;
}

interface IngredientItem {
  name: string;
  gi?: number; // Optional as not all ingredients have GI
  shortMessage?: string;
  description?: string[];
  riskLevel?: string;
}

interface CategorizedIngredients {
  [category: string]: IngredientItem[];
}

interface TopRisk {
  name: string;
  keyword: string;
  title: string;
  detail: string;
}

interface ReportResultData {
  productName?: string;
  productImageUrl?: string; // 이미지 URL 필드 추가 (API 응답에 따라 확인 필요)
  totalWeight?: string; // API 응답에 없으므로, 필요시 추가 또는 고정값 사용
  kcal?: number;
  estimatedGi?: number;
  giIndex?: number;
  nutrientRatios?: NutrientRatio[];
  nutrientDetails?: NutrientDetail[];
  categorizedIngredients?: CategorizedIngredients;
  topRisks?: TopRisk[];
}

export default function ReportPage({ params: paramsPromise }: ReportPageProps) {
  const params = use(paramsPromise);
  const { productId } = params;
  const [report, setReport] = useState<ReportResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchReport = async () => {
        try {
          setLoading(true);
          const data: ApiResponse<ReportResultData> = await getReport(productId);
          if (data && data.success) {
            setReport(data.data);
            console.log("Fetched report data:", data.data);
          } else {
            console.error("Failed to fetch report or no data:", data);
            setError(data.error || null );
            setReport(null);
          }
        } catch (err) {
          console.error("Error fetching report:", err);
          setError(err as ApiError);
          setReport(null);
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [productId]);

  // GI 지수 게이지 차트 데이터
  const giGaugeData = report?.giIndex !== undefined ? [
    { name: '백분율', value: report.giIndex, color: '#FFFFFF' },
    { name: '남은 비율', value: 100 - report.giIndex, color: 'transparent' }
  ] : [
    { name: '백분율', value: 0, color: '#FFFFFF' },
    { name: '남은 비율', value: 100, color: 'transparent' }
  ];
  
  // 탄단지 비율 (API 데이터로 매핑)
  const nutritionDataForChart = report?.nutrientRatios?.map(ratio => ({
    name: ratio.name,
    value: ratio.percent,
    fill: ratio.name === '탄수화물' ? '#8b5cf6' : ratio.name === '단백질' ? '#4f46e5' : '#0ea5e9'
  })) || [];

  // 주의사항 데이터 추출 (nutrientDetails 기반)
  const bloodSugarIngredientsCount = report?.nutrientDetails?.filter(d => d.grade === '위험' && (d.name === '당류' || d.name === '탄수화물')).length || 0;
  const saturatedFatStatus = report?.nutrientDetails?.find(d => d.name === '포화지방')?.grade || "정보 없음";
  const cholesterolStatus = report?.nutrientDetails?.find(d => d.name === '콜레스테롤')?.grade || "정보 없음";
  const sodiumStatus = report?.nutrientDetails?.find(d => d.name === '나트륨')?.grade || "정보 없음";

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
        <p className="text-gray-700 mb-6">{error.message}</p>
        <Link href="/" className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
        <p className="text-xl font-semibold text-gray-700 mb-4">리포트 정보를 찾을 수 없습니다.</p>
        <p className="text-sm text-gray-500 mb-6">해당 ID({productId})의 리포트가 존재하지 않거나, 데이터를 불러오는 데 문제가 발생했습니다.</p>
        <Link href="/" className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

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

      {/* 제품명 표시 */}
      <div className="text-xl font-bold text-gray-800 text-start mb-8 bg-white rounded-2xl shadow-md p-5 transform transition-all hover:shadow-lg">
        {report.productName || "제품명 없음"}
      </div>

      {/* 통합 GI 지수 & 탄단지 비율 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5 transform transition-all hover:shadow-lg">
          <div className="flex items-center mb-4">
            <ChartLine size={22} className="text-violet-600 mr-2" weight="bold" />
            <h2 className="font-bold text-lg text-gray-800">통합 GI 지수 ({report.giIndex || '정보없음'})</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative" style={{ width: 160, height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
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
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div 
                className="absolute bottom-0 left-1/2 w-[2px] h-[60px] bg-gray-800 origin-bottom z-10 transition-transform duration-500 ease-out"
                style={{ 
                  transform: `translateX(-50%) rotate(${(report.giIndex || 0) * 1.8 - 90}deg)`
                }}
              >
                <div className="w-[6px] h-[6px] rounded-full bg-gray-800 absolute -top-[3px] -left-[2px]"></div>
              </div>
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
            <h2 className="font-bold text-lg text-gray-800">영양소 비율</h2>
          </div>
          <div className="flex flex-col items-center">
            <div style={{ width: 120, height: 120 }} className="mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nutritionDataForChart}
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
                    {nutritionDataForChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              {nutritionDataForChart.map((item, index) => (
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
          <h2 className="font-bold text-lg text-gray-800">섭취 주의사항</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-red-100 flex items-center gap-3 transform transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <Heart size={20} className="text-red-500" weight="fill" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">혈당 주의 성분</div>
              <div className="text-sm font-bold text-red-500">{bloodSugarIngredientsCount}개</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-yellow-100 flex items-center gap-3 transform transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-500 text-lg">🦴</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">포화지방</div>
              <div className={`text-sm font-bold ${saturatedFatStatus === '위험' ? 'text-red-500' : saturatedFatStatus === '주의' ? 'text-yellow-500' : 'text-green-500'}`}>{saturatedFatStatus}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-yellow-100 flex items-center gap-3 transform transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-500 text-lg">⭐</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">콜레스테롤</div>
              <div className={`text-sm font-bold ${cholesterolStatus === '위험' ? 'text-red-500' : cholesterolStatus === '주의' ? 'text-yellow-500' : 'text-green-500'}`}>{cholesterolStatus}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-orange-100 flex items-center gap-3 transform transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-500 text-lg">🎃</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800">나트륨</div>
              <div className={`text-sm font-bold ${sodiumStatus === '위험' ? 'text-red-500' : sodiumStatus === '주의' ? 'text-yellow-500' : 'text-green-500'}`}>{sodiumStatus}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 버튼 */}
      <div className="flex flex-col gap-3 mt-8">
        <Link 
          href={`/report/${productId}/safety`} 
          className="flex items-center justify-center gap-2 bg-violet-600 text-white rounded-xl py-4 font-bold shadow-md shadow-violet-200 transition-all hover:bg-violet-700 active:scale-[0.98]"
        >
          <ChartLine size={18} weight="bold" />
          식품 상세 리포트 보러가기
        </Link>
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
