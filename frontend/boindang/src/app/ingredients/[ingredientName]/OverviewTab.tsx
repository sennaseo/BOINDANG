'use client';

import React from 'react';
import { ArrowSquareOut } from '@phosphor-icons/react';

interface OverviewTabProps {
  details: string;
  mainFoods: string[];
  references: Array<{ text: string; url: string }>;
}

export default function OverviewTab({ details, mainFoods, references }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* 상세 정보 */}
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">상세 정보</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {details}
        </p>
      </section>

      {/* 주요 함유 식품 */}
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">주요 함유 식품</h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 pl-2">
          {mainFoods.map((food) => (
            <li key={food}>{food}</li>
          ))}
        </ul>
      </section>

      {/* 참고 문헌 */}
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">참고 문헌</h2>
        <ul className="space-y-3">
          {references.map((ref) => (
            <li key={ref.text} className="text-xs text-slate-600 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
              <a href={ref.url || '#'} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start hover:text-purple-600">
                <span className="flex-1">{ref.text}</span>
                {ref.url && ref.url !== '#' && <ArrowSquareOut size={16} className="text-slate-500 group-hover:text-purple-500 ml-1.5 flex-shrink-0 relative top-0.5" />}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
} 