'use client';

import { useEffect, useState } from 'react';
import BottomNavBar from "@/components/navigation/BottomNavBar";
import QuizHeader from '@/components/more/quiz/QuizHeader';
import QuizStats from '@/components/more/quiz/QuizStats';
import QuizWrongAnswers from '@/components/more/quiz/QuizWrongAnswers';
import { fetchQuizStatistics, fetchWrongAnswers } from '@/api/more/quiz';
import type { QuizStatistics, WrongAnswer } from '@/types/api/more/quiz';

export default function QuizPage() {
  const [selectedSection, setSelectedSection] = useState('stats');
  const [stats, setStats] = useState<QuizStatistics>({
    totalSolved: 0,
    correctCount: 0,
    wrongCount: 0,
    accuracy: 0
  });
  const [quizHistory, setQuizHistory] = useState<WrongAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const [statisticsData, historyData] = await Promise.all([
          fetchQuizStatistics(),
          fetchWrongAnswers()
        ]);
        setStats(statisticsData);
        setQuizHistory(historyData);
      } catch (error) {
        console.error('퀴즈 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, []);

  const correctAnswers = quizHistory.filter(quiz => quiz.isCorrect);
  const wrongAnswers = quizHistory.filter(quiz => !quiz.isCorrect);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col mx-5 pt-5 pb-20 min-h-screen">
      <QuizHeader />
      
      {/* 통계 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-600">총 문제</span>
          <span className="text-2xl font-bold text-[#363636]">{stats.totalSolved}</span>
        </div>
        <div className="bg-green-100 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-600">정답</span>
          <span className="text-2xl font-bold text-green-600">{stats.correctCount}</span>
        </div>
        <div className="bg-orange-100 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-600">오답</span>
          <span className="text-2xl font-bold text-orange-600">{stats.wrongCount}</span>
        </div>
      </div>
      
      {/* 섹션 선택 버튼 */}
      <div className="flex justify-center border-b mb-5">
        <button 
          onClick={() => setSelectedSection('stats')}
          className={`w-1/3 py-2 px-5 font-medium ${
            selectedSection === 'stats' 
              ? 'border-b-2 border-morered text-morered' 
              : 'text-gray-500'
          }`}
        >
          통계
        </button>
        <button 
          onClick={() => setSelectedSection('correctAnswers')}
          className={`w-1/3 py-2 px-5 font-medium ${
            selectedSection === 'correctAnswers' 
              ? 'border-b-2 border-morered text-morered' 
              : 'text-gray-500'
          }`}
        >
          맞힌 문제
        </button>
        <button 
          onClick={() => setSelectedSection('wrongAnswers')}
          className={`w-1/3 py-2 px-5 font-medium ${
            selectedSection === 'wrongAnswers' 
              ? 'border-b-2 border-morered text-morered' 
              : 'text-gray-500'
          }`}
        >
          틀린 문제
        </button>
      </div>
      
      {/* 선택된 섹션 내용 */}
      {selectedSection === 'stats' ? (
        <QuizStats stats={stats} />
      ) : selectedSection === 'correctAnswers' ? (
        <QuizWrongAnswers answers={correctAnswers} isCorrect={true} />
      ) : (
        <QuizWrongAnswers answers={wrongAnswers} isCorrect={false} />
      )}
      
      <BottomNavBar />
    </div>
  );
}
