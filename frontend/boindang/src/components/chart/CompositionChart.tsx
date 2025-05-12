import * as React from 'react';
import { ResponsivePie } from '@nivo/pie';

interface PieChartProps {
    data: {
        id: string;
        label: string;
        value: number;
        color: string;
    }[];
}

export default function CompositionChart({ data }: PieChartProps) {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div style={{ width: 220, height: 220 }}>
                <ResponsivePie
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.6}
                    padAngle={2}
                    cornerRadius={8}
                    activeOuterRadiusOffset={8}
                    colors={{ datum: 'data.color' }}
                    borderWidth={2}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor="#222"
                    theme={{
                        labels: { text: { fontSize: 16, fontWeight: 700 } },
                    }}
                />
            </div>
            {/* 범례 */}
            <div className="mt-4 flex flex-col gap-1 text-sm w-full">
                {data.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold">{item.label}</span>
                        <span className="ml-auto">{item.value}g</span>
                    </div>
                ))}
            </div>
        </div>
    );
}