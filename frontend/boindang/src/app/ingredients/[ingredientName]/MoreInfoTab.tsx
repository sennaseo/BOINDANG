'use client';

import React from 'react';
import type { MoreInfoTabProps } from '@/types/api/ingredients';

interface ComparisonItemUiProps {
  name: string;
  gi: string;
  calories: string;
  sweetness: string;
  riskLevel: string;
}

const MoreInfoTab: React.FC<MoreInfoTabProps> = ({ info }) => {
  return (
    <div className="space-y-8 p-1">
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">안전성 및 규제</h2>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {info.safetyRegulation}
        </p>
      </section>

      <section>
        <h3 className="text-md font-semibold mt-4 mb-2 text-slate-700">유사 성분 비교</h3>
        {info.comparison && info.comparison.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th scope="col" className="px-4 py-3">성분명</th>
                  <th scope="col" className="px-4 py-3">GI</th>
                  <th scope="col" className="px-4 py-3">칼로리(kcal/g)</th>
                  <th scope="col" className="px-4 py-3">감미도(설탕대비)</th>
                  <th scope="col" className="px-4 py-3">위험도</th>
                </tr>
              </thead>
              <tbody>
                {info.comparison.map((item: ComparisonItemUiProps) => (
                  <tr key={item.name} className="bg-white border-b hover:bg-slate-50">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                      {item.name}
                    </th>
                    <td className="px-4 py-3">{item.gi}</td>
                    <td className="px-4 py-3">{item.calories}</td>
                    <td className="px-4 py-3">{item.sweetness}</td>
                    <td className="px-4 py-3">{item.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">비교 정보가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default MoreInfoTab; 