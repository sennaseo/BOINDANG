'use client';

import React from 'react';

interface ComparisonItem {
  name: string;
  gi: number | string;
  calories: number | string;
  sweetness: number | string;
  note: string;
}

interface MoreInfoTabProps {
  info: {
    safetyRegulation: string;
    comparison: ComparisonItem[];
  };
}

export default function MoreInfoTab({ info }: MoreInfoTabProps) {
  return (
    <div className="space-y-8 p-1">
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">안전성 및 규제</h2>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {info.safetyRegulation}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">유사 성분 비교</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-slate-600 bg-white shadow-md rounded-lg">
            <thead className="bg-slate-100 text-xs text-slate-700 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">성분</th>
                <th scope="col" className="px-4 py-3">혈당 지수</th>
                <th scope="col" className="px-4 py-3">칼로리 (kcal/g)</th>
                <th scope="col" className="px-4 py-3">감미도 (설탕=1)</th>
                <th scope="col" className="px-4 py-3">비고</th>
              </tr>
            </thead>
            <tbody>
              {info.comparison.map((item) => (
                <tr key={item.name} className="border-b border-slate-200 hover:bg-slate-50">
                  <th scope="row" className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                    {item.name}
                  </th>
                  <td className="px-4 py-3">{item.gi}</td>
                  <td className="px-4 py-3">{item.calories}</td>
                  <td className="px-4 py-3">{item.sweetness}</td>
                  <td className="px-4 py-3">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
} 