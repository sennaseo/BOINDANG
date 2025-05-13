import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface SafetyChartProps {
  value: number; // 0~100
}

const COLORS = ["#22c55e", "#eab308", "#ef4444"]; // 안전, 주의, 위험

// 게이지 구간별로 value를 나눠서 표시
function getGaugeData(value: number) {
  // 안전: 0~33, 주의: 34~66, 위험: 67~100
  const safe = Math.min(value, 33);
  const caution = Math.min(Math.max(value - 33, 0), 33);
  const danger = Math.max(value - 66, 0);

  return [
    { name: "안전", value: safe, color: COLORS[0] },
    { name: "주의", value: caution, color: COLORS[1] },
    { name: "위험", value: 100 - danger, color: COLORS[2] },
  ];
}

export default function SafetyChart({ value }: SafetyChartProps) {
  const data = getGaugeData(value);

  // 바늘 각도 계산 (180도 기준, 0~100)
  const angle = 180 * (value / 100);

  return (
    <div style={{ width: 220, height: 120, position: "relative" }}>
      <PieChart width={220} height={120}>
        <Pie
          data={data}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          cx="50%"
          cy="100%"
          innerRadius={60}
          outerRadius={100}
          cornerRadius={10}
          paddingAngle={1}
          isAnimationActive={true}
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      {/* 바늘 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 20,
          width: 0,
          height: 0,
          transform: `translateX(-50%) rotate(${90 + angle}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            width: 4,
            height: 70,
            background: "#222",
            borderRadius: 2,
            margin: "0 auto",
          }}
        />
        <div
          style={{
            width: 16,
            height: 16,
            background: "#222",
            borderRadius: "50%",
            position: "absolute",
            left: "50%",
            bottom: -8,
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </div>
  );
}