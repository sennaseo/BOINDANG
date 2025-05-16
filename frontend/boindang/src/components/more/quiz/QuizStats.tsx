import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { QuizStatistics } from '@/types/api/more/quiz';

interface QuizStatsProps {
  stats: QuizStatistics;
}

const COLORS = ['#00C49F', '#FF8042'];

export default function QuizStats({ stats }: QuizStatsProps) {
  const data = [
    { name: '정답', value: stats.correctCount },
    { name: '오답', value: stats.wrongCount },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-5">
      <h2 className="text-lg font-bold mb-4 text-center">정답률</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-4">
        <p className="text-xl font-bold">{stats.accuracy.toFixed(1)}%</p>
        <p className="text-sm text-gray-500">총 정답률</p>
      </div>
    </div>
  );
} 