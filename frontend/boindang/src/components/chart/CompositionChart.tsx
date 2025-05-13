import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip, Sector } from "recharts";

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

export default function CompositionChart({ data }: PieChartProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [innerData, setInnerData] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    // 컴포넌트 마운트 시 첫 번째 카테고리 자동 선택
    useEffect(() => {
        if (data && data.length > 0) {
            const firstCategory = data[0];
            setSelectedCategory(firstCategory.id);
            setInnerData(firstCategory.subData || []);
            setActiveIndex(0);
        }
    }, [data]);

    const handleOuterPieClick = (data: any) => {
        if (data && data.payload) {
            const category = data.payload.id;
            setSelectedCategory(category);
            setInnerData(data.payload.subData || []);
        }
    };

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(undefined);
    };

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 5}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    cornerRadius={10}
                    style={{
                        filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))',
                        transition: 'all 0.3s ease'
                    }}
                />
            </g>
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white rounded-xl shadow p-4">
                    <p>{payload[0].name}</p>
                    <p>{payload[0].value}g</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div style={{ width: 300, height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={data} 
                            dataKey="value" 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={1}
                            cornerRadius={10}
                            onClick={handleOuterPieClick}
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
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
                        <Pie
                            data={innerData.length > 0 ? innerData : data}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={55}
                            paddingAngle={1}
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
            {/* 범례 */}
            <div className="mt-4 flex flex-col gap-1 text-sm w-full">
                {(innerData.length > 0 ? innerData : data).map((item) => (
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