'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import BottomNavBar from "@/components/navigation/BottomNavBar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// 목업 데이터
const QUIZ_STATS = {
  totalQuestions: 30,
  correctAnswers: 21,
  wrongAnswers: 9,
  accuracyRate: 70
};

const COLORS = ['#00C49F', '#FF8042'];

// 오답노트 목업 데이터
const WRONG_ANSWERS = [
  {
    id: 1,
    question: '무기질이 풍부한 식품은?',
    options: ['사과', '시금치', '초콜릿', '흰 빵'],
    correctAnswer: '시금치',
    userAnswer: '사과',
    explanation: '시금치는 철분, 칼슘 등 다양한 무기질이 풍부합니다.',
  },
  {
    id: 2,
    question: '다음 중 탄수화물 함량이 가장 높은 식품은?',
    options: ['계란', '쌀밥', '소고기', '연어'],
    correctAnswer: '쌀밥',
    userAnswer: '소고기',
    explanation: '쌀밥은 대표적인 탄수화물 공급원입니다.',
  },
  {
    id: 3,
    question: '당뇨 환자에게 가장 좋은 식품은?',
    options: ['백미', '통밀빵', '단 과일', '초콜릿'],
    correctAnswer: '통밀빵',
    userAnswer: '단 과일',
    explanation: '통밀빵은 혈당 지수가 낮고 식이섬유가 풍부합니다.',
  },
];

export default function QuizPage() {
  const [selectedSection, setSelectedSection] = useState('stats');
  
  const data = [
    { name: '정답', value: QUIZ_STATS.correctAnswers },
    { name: '오답', value: QUIZ_STATS.wrongAnswers },
  ];

  return (
    <div className="flex flex-col mx-5 pt-5 pb-20 min-h-screen">
      {/* 헤더 */}
      <div className="flex flex-row items-center mb-6">
        <Link href="/more">
          <ArrowLeft size={24} weight="bold" fill="#363636" className="mr-3" />
        </Link>
        <h1 className="text-xl font-bold text-[#363636]">내 퀴즈</h1>
      </div>
      
      {/* 통계 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-600">총 문제</span>
          <span className="text-2xl font-bold text-[#363636]">{QUIZ_STATS.totalQuestions}</span>
        </div>
        <div className="bg-green-100 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-600">정답</span>
          <span className="text-2xl font-bold text-green-600">{QUIZ_STATS.correctAnswers}</span>
        </div>
        <div className="bg-orange-100 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-600">오답</span>
          <span className="text-2xl font-bold text-orange-600">{QUIZ_STATS.wrongAnswers}</span>
        </div>
      </div>
      
      {/* 섹션 선택 버튼 */}
      <div className="flex border-b mb-5">
        <button 
          onClick={() => setSelectedSection('stats')}
          className={`py-2 px-5 font-medium ${
            selectedSection === 'stats' 
              ? 'border-b-2 border-morered text-morered' 
              : 'text-gray-500'
          }`}
        >
          통계
        </button>
        <button 
          onClick={() => setSelectedSection('wrongAnswers')}
          className={`py-2 px-5 font-medium ${
            selectedSection === 'wrongAnswers' 
              ? 'border-b-2 border-morered text-morered' 
              : 'text-gray-500'
          }`}
        >
          오답노트
        </button>
      </div>
      
      {/* 선택된 섹션 내용 */}
      {selectedSection === 'stats' ? (
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
            <p className="text-xl font-bold">{QUIZ_STATS.accuracyRate}%</p>
            <p className="text-sm text-gray-500">총 정답률</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">틀린 문제 ({WRONG_ANSWERS.length})</h2>
          {WRONG_ANSWERS.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="font-medium mb-2">Q. {item.question}</p>
              <div className="space-y-1 mb-3">
                {item.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded-lg text-sm ${
                      option === item.correctAnswer 
                        ? 'bg-green-100 text-green-800' 
                        : option === item.userAnswer && option !== item.correctAnswer
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100'
                    }`}
                  >
                    {option} 
                    {option === item.correctAnswer && ' (정답)'}
                    {option === item.userAnswer && option !== item.correctAnswer && ' (내 선택)'}
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{item.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <BottomNavBar />
    </div>
  );
}
