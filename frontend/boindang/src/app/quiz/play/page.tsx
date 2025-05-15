'use client';

import { useState, useEffect } from 'react';
import QuizQuestion from '../../../components/quiz/QuizQuestion';
import QuizResult from '../../../components/quiz/QuizResult';
import BottomNavBar from '../../../components/navigation/BottomNavBar';
import { fetchQuizList, submitQuizAnswer } from '../../../api/quiz';
import { Quiz, QuizAnswerResult } from '../../../types/api/quiz';
import Confetti from 'react-confetti';

export default function QuizPlayPage() {
  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); // 0~4: 문제, 5: 결과
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answerResult, setAnswerResult] = useState<QuizAnswerResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (step === quizList.length) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [step, quizList.length]);

  useEffect(() => {
    fetchQuizList().then(res => {
      setQuizList(res);
      setLoading(false);
    });
  }, []);

  const quiz = quizList[step];
  console.log('현재 문제 quiz:', quiz); // quiz가 배열이 아닌지 확인

  const handleSelect = (optionIdx: number) => {
    setSelected(optionIdx);
  };

  const handleSubmit = async () => {
    if (!quiz || selected === null) return;
    try {
      const res = await submitQuizAnswer(quiz.quizId, selected +1);
      setAnswerResult(res);
      if (res.correct) setScore(s => s + 1);
    } catch (e) {
      setAnswerResult({ correct: false, explanation: '정답 확인에 실패했습니다.', answer: -1 });
    }
  };

  const handleNext = () => {
    setSelected(null);
    setAnswerResult(null);
    setStep(s => s + 1);
  };

  const handleRetry = () => {
    setStep(0);
    setSelected(null);
    setScore(0);
    setAnswerResult(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-screen-sm mx-auto">
      <div className="flex-1 flex flex-col justify-start px-6 pt-8 pb-24 relative">
        {/* 진행도 표시 (문제 풀이 중에만) */}
        {loading ? (
          <div className="text-center mt-16 text-lg">퀴즈를 불러오는 중...</div>
        ) : step < quizList.length && (
          <div className="w-full max-w-xs mx-auto mb-2">
            {/* <div className="text-lg font-bold text-center mb-1">
              Q{step + 1} / {quizList.length}
            </div> */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#6C2FF2] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / quizList.length) * 100}%` }}
              />
            </div>
          </div>
        )}
        {/* 퀴즈 본문 */}
        <div className="flex-1 flex flex-col justify-start">
          {loading ? null : step < quizList.length ? (
            selected !== null && answerResult
              ? <QuizResult
                  quiz={quiz}
                  selected={selected}
                  onNext={handleNext}
                  isLast={step === quizList.length - 1}
                  index={step}
                  answerResult={answerResult}
                />
              : <QuizQuestion
                  quiz={quiz}
                  onSelect={handleSelect}
                  selected={selected}
                  onSubmit={handleSubmit}
                  index={step}
                />
          ) : (
            <div className="text-center mt-16">
              {showConfetti && (
                <Confetti
                  width={windowSize.width}
                  height={windowSize.height}
                  recycle={false}
                  numberOfPieces={200}
                  gravity={0.3}
                />
              )}
              <img
                src="/assets/quiz/sugar_quiz_complete.png"
                alt="퀴즈 완료"
                className="w-80 h-80 object-contain mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">영양 지식이 쌓였어요!</h2>
              <p className="text-lg text-gray-700 mb-4">오늘도 건강한 식습관을 위한 한 걸음!<br/>내일도 도전해보세요.</p>
              <p className="mb-2">정답: <span className="font-bold text-[#6C2FF2]">{score} / {quizList.length}</span></p>
              <button className="mt-4 w-full bg-[#6C2FF2] text-white py-3 rounded-xl font-semibold" onClick={handleRetry}>
                다시 풀기
              </button>
            </div>
          )}
        </div>
        {/* 하단 고정 버튼은 QuizResult에서 처리 */}
      </div>
      <BottomNavBar />
    </div>
  );
}
