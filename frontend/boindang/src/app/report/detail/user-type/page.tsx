"use client";

import React from "react";
import ReportTabNav from "@/components/navigation/ReportTabNav";     
import { CaretLeft } from "@phosphor-icons/react";
import Image from "next/image";
export default function UserTypePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* 헤더 */}
      <header className="flex items-center mb-2">
        <button className="mr-2 text-2xl"><CaretLeft/></button>
        <h1 className="text-2xl font-bold mx-auto">리포트</h1>
      </header>
      <ReportTabNav />

      {/* 다이어터 안내 */}
      <section className="mb-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <span className="text-green-500 font-bold">다이어터</span> 유저 타입에 대한 리포트 입니다
        </div>
      </section>

      {/* 주의해야할 성분 top 3 */}
      <section>
        <h2 className="font-bold text-lg mb-2">주의해야할 성분 top 3</h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white rounded-xl shadow p-4 flex items-center">
            <div className="text-3xl font-bold mr-4">1위</div>
            <div>
              <div className="font-bold text-lg">말토덱스트린</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">신장</span>
                <span className="text-red-500 font-bold text-sm">인산염 위험!</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                신장질환자는 인산염이 혈중 인을 증가시켜<br />
                뼈의 손상 및 통증을 유발할 수 있습니다.
              </div>
            </div>
            <div className="ml-auto">
              <Image src="/assets/report/skeleton.png" width={64} height={64} alt="skeleton" />
            </div>
          </div>
          {/* 2, 3위도 필요시 추가 */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center">
            <div className="text-3xl font-bold mr-4">2위</div>
            <div>
              <div className="font-bold text-lg">말토덱스트린</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">신장</span>
                <span className="text-red-500 font-bold text-sm">인산염 위험!</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                신장질환자는 인산염이 혈중 인을 증가시켜<br />
                뼈의 손상 및 통증을 유발할 수 있습니다.
              </div>
            </div>
            <div className="ml-auto">
              <Image src="/assets/report/skeleton.png" width={64} height={64} alt="skeleton" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center">
            <div className="text-3xl font-bold mr-4">3위</div>
            <div>
              <div className="font-bold text-lg">말토덱스트린</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">신장</span>
                <span className="text-red-500 font-bold text-sm">인산염 위험!</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                신장질환자는 인산염이 혈중 인을 증가시켜<br />
                뼈의 손상 및 통증을 유발할 수 있습니다.
              </div>
            </div>
            <div className="ml-auto">
              <Image src="/assets/report/skeleton.png" width={64} height={64} alt="skeleton" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
