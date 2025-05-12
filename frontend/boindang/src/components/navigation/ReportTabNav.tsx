"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { name: "안전도 체크", path: "/report/detail/safety" },
  { name: "성분 구성", path: "/report/detail/composition" },
  { name: "유저 타입별", path: "/report/detail/user-type" },
];

export default function ReportTabNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => router.push(tab.path)}
          className={`flex-1 py-2 text-center font-semibold ${
            pathname === tab.path
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