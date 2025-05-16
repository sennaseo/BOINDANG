"use client";

import React, { useState, useEffect } from "react";
import ReportTabNav from "@/components/navigation/ReportTabNav";     
import { CaretLeft } from "@phosphor-icons/react";
import Image from "next/image";
import { useParams, useRouter } from 'next/navigation';
import { getReport } from "@/api/report";

// --- 타입 정의 시작 ---
interface TopRisk {
  name: string;    // 성분명 (e.g., "말토덱스트린")
  keyword: string; // 관련 키워드 (e.g., "신장")
  title: string;   // 위험 요약 (e.g., "인산염 위험!")
  detail: string;  // 상세 설명
  // imageUrl?: string; // API 응답에 있다면 이미지 URL 추가 가능
}

interface ReportResultData {
  productName?: string;
  // ... 다른 ReportResultData 필드들 ...
  topRisks?: TopRisk[];
}

interface ApiReportResponse {
  success: boolean;
  code: number;
  message: string;
  result: ReportResultData;
}
// --- 타입 정의 끝 ---

// 키워드에 따른 스타일 (예시)
const getKeywordStyle = (keyword: string) => {
  // 실제 키워드 값에 따라 다른 스타일을 반환하도록 확장 가능
  if (keyword.includes("신장") || keyword.includes("콩팥")) {
    return "bg-blue-100 text-blue-600";
  }
  if (keyword.includes("혈당") || keyword.includes("당뇨")) {
    return "bg-red-100 text-red-600";
  }
  if (keyword.includes("간")) {
    return "bg-green-100 text-green-600";
  }
  return "bg-gray-100 text-gray-600"; // 기본값
};

export default function UserTypePage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [reportData, setReportData] = useState<ReportResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchReportData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response: ApiReportResponse = await getReport(productId);
          if (response && response.success) {
            setReportData(response.result);
          } else {
            setError(response?.message || "리포트 데이터를 불러오는데 실패했습니다.");
            setReportData(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다.");
          setReportData(null);
        }
        setLoading(false);
      };
      fetchReportData();
    } else {
      setError("productId가 제공되지 않았습니다.");
      setLoading(false);
    }
  }, [productId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl font-semibold text-gray-700">리포트 로딩 중...</p></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
        <p className="text-xl font-semibold text-red-500 mb-4">오류 발생</p>
        <p className="text-gray-700 mb-6 text-center">{error}</p>
        <button onClick={() => router.push('/')} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">홈으로 돌아가기</button>
      </div>
    );
  }
  
  if (!reportData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
        <p className="text-xl font-semibold text-gray-700 mb-4">리포트 정보를 찾을 수 없습니다.</p>
        {productId && <p className="text-sm text-gray-500 mb-6">해당 ID({productId})의 리포트가 존재하지 않거나, 데이터를 불러오는 데 문제가 발생했습니다.</p>}
        <button onClick={() => router.push('/')} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">홈으로 돌아가기</button>
      </div>
    );
  }

  const topRisks = reportData.topRisks || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <header className="flex items-center mb-2">
        <button onClick={() => router.push(`/report/${productId}`)} className="mr-2 text-2xl"><CaretLeft/></button>
        <h1 className="text-2xl font-bold mx-auto">리포트 ({reportData.productName || "제품"})</h1>
      </header>
      <ReportTabNav productId={productId} />

      {/* TODO: 사용자 타입 정보가 API에 있다면 동적으로 변경 */}
      <section className="mb-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <span className="text-green-500 font-bold">다이어터</span> 유저 타입에 대한 리포트 입니다
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3">주의해야 할 성분 Top {topRisks.length > 0 ? topRisks.length : ''}</h2>
        {topRisks.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {topRisks.map((risk, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-4 flex items-start">
                <div className="text-3xl font-bold mr-4 text-violet-600">{index + 1}위</div>
                <div className="flex-1">
                  <div className="font-bold text-lg mb-0.5">{risk.name}</div>
                  <div className="flex items-center gap-2 mt-1 mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getKeywordStyle(risk.keyword)}`}>{risk.keyword}</span>
                    <span className="text-red-500 font-bold text-sm">{risk.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {risk.detail.split('<br />').map((line, i) => <React.Fragment key={i}>{line}{i !== risk.detail.split('<br />').length -1 && <br />}</React.Fragment>)}
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  {/* API에 risk.imageUrl이 있다면 사용, 없다면 기본 이미지 */}
                  <Image src={/*risk.imageUrl ||*/ "/assets/report/skeleton.png"} width={56} height={56} alt={`${risk.name} 관련 이미지`} className="opacity-80" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-gray-500">주의해야 할 주요 성분 정보가 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
