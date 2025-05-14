'use client';

import React from 'react';
import { Leaf, Drop, PersonSimpleRun, FirstAidKit } from '@phosphor-icons/react'; // Kidney를 Drop으로 변경
import type { UserSpecificTabProps } from '@/types/api/ingredients';

const iconMap = {
  diabetes: <FirstAidKit size={20} className="mr-2 text-red-500" weight="fill" />, // 당뇨 아이콘 (예시)
  kidney: <Drop size={20} className="mr-2 text-blue-500" weight="fill" />, // Kidney 아이콘을 Drop으로 변경
  diet: <Leaf size={20} className="mr-2 text-green-500" weight="fill" />,         // 다이어트 아이콘 (예시)
  exercise: <PersonSimpleRun size={20} className="mr-2 text-orange-500" weight="fill" /> // 운동 아이콘 (예시)
};

export default function UserSpecificTab({ considerations }: UserSpecificTabProps) {
  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">사용자 유형별 참고사항</h2>

      <div className="space-y-4">
        {Object.entries(considerations).map(([key, value]) => {
          let title = '';
          switch (key) {
            case 'diabetes': title = '당뇨 환자'; break;
            case 'kidney': title = '신장 질환자'; break;
            case 'diet': title = '다이어트 중'; break;
            case 'exercise': title = '운동/근력 향상'; break;
            default: title = key;
          }
          return (
            <div key={key} className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-md font-semibold text-slate-700 mb-2 flex items-center">
                {iconMap[key as keyof typeof iconMap]}
                {title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
} 