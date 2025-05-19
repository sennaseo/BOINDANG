"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { name: "안전도 체크", path: "/report/{productId}/safety" },
  { name: "성분 구성", path: "/report/{productId}/composition" },
  { name: "유저 타입별", path: "/report/{productId}/user-type" },
];

export default function ReportTabNav({ productId }: { productId: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // 현재 경로가 특정 탭과 일치하는지 확인하는 함수
  const isActive = (tabPath: string) => {
    // 탭 경로에서 {productId} 부분을 실제 productId로 대체
    const processedPath = tabPath.replace("{productId}", productId);
    // 현재 경로와 처리된 탭 경로가 일치하는지 확인
    return pathname === processedPath;
  };

  return (
    <nav className="flex border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => router.push(tab.path.replace("{productId}", productId))}
          className={`flex-1 py-2 text-center font-semibold cursor-pointer ${
            isActive(tab.path)
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
          }`}
        >
          {tab.name}
        </button>
      ))}
    </nav>
  );
}