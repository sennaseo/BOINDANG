'use client';

import React from 'react';
import type { HealthImpactTabProps } from '@/types/api/ingredients';

export default function HealthImpactTab({ effects }: HealthImpactTabProps) {
  return (
    <div className="space-y-6 p-1">
      <section>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">혈당/인슐린 반응</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{effects.bloodSugar}</p>
      </section>
      <section>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">소화기계 영향</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{effects.digestive}</p>
      </section>
      <section>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">충치 영향</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{effects.dental}</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <section>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">장점</h3>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 pl-2">
            {effects.pros.map((pro, index) => (
              <li key={index}>{pro}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">단점</h3>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 pl-2">
            {effects.cons.map((con, index) => (
              <li key={index}>{con}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
} 