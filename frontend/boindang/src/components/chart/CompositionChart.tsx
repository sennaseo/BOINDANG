import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
// 차트에 표시될 데이터의 타입 정의
interface PieChartProps {
    data: {
        id: string;
        label: string;
        value: number;
        color: string;
        subData?: {
            id: string;
            label: string;
            value: number;
            color: string;
        }[];
    }[];
}
// 파이 차트의 각 섹션 데이터 타입 정의
interface PieData {
    id: string;
    label: string;
    value: number;
    color: string;
    subData?: PieData[];
}

// 툴크 데이터 타입 정의
interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        payload: {
            id: string;
            label: string;
            value: number;
            color: string;
            subData?: PieData[];
        };
    }>;
}

// 컴포지션 차트 컴포넌트
export default function CompositionChart({ data }: PieChartProps) {
    // 내부 데이터 상태 관리
    const [innerData, setInnerData] = useState<PieData[]>([]);
    // 활성 섹션 인덱스 상태 관리
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    // 컴포넌트 마운트 시 첫 번째 카테고리 자동 선택
    useEffect(() => {
        if (data && data.length > 0) {
            const firstCategory = data[0];
            setInnerData(firstCategory.subData || []);
            setActiveIndex(0);
        }
    }, [data]);

    // 외부 파이 클릭 시 내부 데이터 업데이트
    const handleOuterPieClick = (data: { payload: PieData }, index: number) => {
        if (data && data.payload) {
            setInnerData(data.payload.subData || []);
            setActiveIndex(index); // 클릭한 섹션의 인덱스를 설정
        }
    };

    // 활성 섹션 데이터 렌더링 
    const renderActiveShape = (props: PieSectorDataItem) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={Number(outerRadius) + 5} // 더 크게 강조
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    cornerRadius={10}
                    style={{
                        filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))', // 그림자 강화
                        transition: 'all 0.5s ease' // 애니메이션 시간 단축
                    }}
                />
            </g>
        );
    };

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length > 0) {
            // payload에는 현재 마우스가 올려진 항목의 데이터가 들어있음
            const item = payload[0];
            return (
                <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.payload.color }}
                        ></div>
                        <p className="font-bold text-lg">{item.value}g</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col flex-wrap items-start">
            {/* 반응형 레이아웃: 작은 화면에서는 수직, 중간 크기 이상에서는 수평 */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                {/* 파이 차트 컨테이너 - 작은 화면에서는 전체 너비, 중간 크기 이상에서는 60% */}
                <div className="w-full md:w-1/2 lg:w-3/5 h-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            {/* 외부 파이 차트 */}
                            <Pie 
                                data={data} 
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={1}
                                cornerRadius={10}
                                onClick={(data, index) => handleOuterPieClick(data, index)}
                                activeIndex={activeIndex}
                                animationEasing="ease"
                                animationDuration={500}
                                animationBegin={0}
                                activeShape={renderActiveShape}
                                style={{
                                    filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
                                }}
                            >
                                {data.map((entry, idx) => (
                                    <Cell 
                                        key={`cell-${idx}`} 
                                        fill={entry.color}
                                        style={{
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                ))}
                            </Pie>
                            {/* 내부 파이 차트 */}
                            <Pie
                                data={innerData.length > 0 ? innerData : data}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={45}
                                paddingAngle={1}
                                animationEasing="ease"
                                animationDuration={500}
                                animationBegin={0}
                                cornerRadius={10}
                                style={{
                                    filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
                                }}
                            >
                                {(innerData.length > 0 ? innerData : data).map((entry, idx) => (
                                    <Cell 
                                        key={`cell-${idx}`} 
                                        fill={entry.color}
                                        style={{
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                content={<CustomTooltip />}
                                wrapperStyle={{
                                    outline: 'none'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* 범례 컨테이너 - 작은 화면에서는 전체 너비, 중간 크기 이상에서는 40% */}
                <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col gap-4">
                    {/* 작은 화면에서는 수평 배치, 중간 크기 이상에서는 수직 배치 */}
                    <div className="grid grid-cols-1 gap-4 w-full">
                        {/* 외부 파이 차트 범례 */}
                        <div className="flex flex-col gap-2 text-sm">
                            <h3 className="font-bold mb-2">주요 성분</h3>
                            <div className="space-y-1">
                                {data.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                                        onClick={() => handleOuterPieClick({ payload: item }, data.findIndex(d => d.id === item.id))}
                                    >
                                        <span
                                            className="inline-block w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className={`font-semibold ${activeIndex === data.findIndex(d => d.id === item.id) ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {item.label}
                                        </span>
                                        <span className={`ml-auto ${activeIndex === data.findIndex(d => d.id === item.id) ? 'font-bold' : ''}`}>
                                            {item.value}g
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 내부 파이 차트 범례 */}
                        {innerData.length > 0 && (
                            <div className="flex flex-col gap-2 text-sm">
                                <h3 className="font-bold mb-2">상세 성분</h3>
                                <div className="space-y-1">
                                    {innerData.map((item) => (
                                        <div key={item.id} className="flex items-center gap-2 p-1">
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}