'use client';

import { useState } from 'react';
import QuizQuestion from '../../../components/quiz/QuizQuestion';
import QuizResult from '../../../components/quiz/QuizResult';
import BottomNavBar from '../../../components/navigation/BottomNavBar';

// 더미 퀴즈 데이터
const quizList = [
  {
    id: 1,
    question: "'당류 0g'이라고 표시된 식품은 혈당을 전혀 올리지 않는다.",
    options: [
      { key: 'A', text: '맞다' },
      { key: 'B', text: '아니다' },
    ],
    answer: 'B',
    explanation: "'당류 0g'이더라도 말토덱스트린, 말티톨, 폴리글리시톨시럽 등은 혈당을 급격히 올릴 수 있음. 이들은 당류로 표기되지 않지만 GI 지수가 매우 높음.",
  },
  {
    id: 2,
    question: '다음 중 GI(혈당지수)가 가장 높은 감미료는?',
    options: [
      { key: 'A', text: '스테비아' },
      { key: 'B', text: '에리스리톨' },
      { key: 'C', text: '말티톨' },
      { key: 'D', text: '타가토스' },
    ],
    answer: 'C',
    explanation: '말티톨의 GI는 약 35로, 스테비아(0), 에리스리톨(0), 타가토스(3)보다 높아 혈당 반응 가능성이 가장 큼.',
  },
  {
    id: 3,
    question: '다음 중 체내에서 칼로리로 거의 사용되지 않고 소변으로 배출되는 감미료는?',
    options: [
      { key: 'A', text: '자일리톨' },
      { key: 'B', text: '수크랄로스' },
      { key: 'C', text: '글리세린' },
      { key: 'D', text: '소르비톨' },
    ],
    answer: 'B',
    explanation: '수크랄로스는 체내 대사가 거의 일어나지 않아 흡수되더라도 대부분 소변으로 배출됨. 칼로리 없음.',
  },
  {
    id: 4,
    question: '‘식이섬유 함유’라고 쓰여 있는 제품이 혈당 상승을 일으킬 수 있는 이유는?',
    options: [
      { key: 'A', text: '섬유소는 항상 혈당을 올린다' },
      { key: 'B', text: '대부분 설탕이 섞여 있다' },
      { key: 'C', text: '일부 식이섬유는 실제로는 소화 가능한 전분이다' },
      { key: 'D', text: '식이섬유는 GI 지수가 높다' },
    ],
    answer: 'C',
    explanation: "덱스트린, 말토덱스트린 등의 경우 '식이섬유'로 분류되기도 하지만 혈당을 높일 수 있는 소화성 탄수화물일 수 있음.",
  },
  {
    id: 5,
    question: '다음 중 충치 예방 효과가 있는 감미료는?',
    options: [
      { key: 'A', text: '설탕' },
      { key: 'B', text: '말티톨' },
      { key: 'C', text: '자일리톨' },
      { key: 'D', text: '아스파탐' },
    ],
    answer: 'C',
    explanation: '자일리톨은 구강 박테리아가 발효하지 못해 산을 생성하지 않으며, 치아 표면에 보호막 형성도 도움을 줌.',
  },
];

export default function QuizPlayPage() {
  const [step, setStep] = useState(0); // 0~4: 문제, 5: 결과
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const quiz = quizList[step];

  const handleSelect = (key) => {
    setSelected(key);
    if (key === quiz.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setStep(s => s + 1);
  };

  const handleRetry = () => {
    setStep(0);
    setSelected(null);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-screen-sm mx-auto">
      <div className="flex-1 flex flex-col justify-start px-6 pt-8 pb-24 relative">
        {/* 진행도 표시 (문제 풀이 중에만) */}
        {step < quizList.length && (
          <div className="w-full max-w-xs mx-auto mb-2">
            <div className="text-lg font-bold text-center mb-1">
              Q{step + 1} / {quizList.length}
            </div>
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
          {step < quizList.length ? (
            selected
              ? <QuizResult
                  quiz={quiz}
                  selected={selected}
                  onNext={handleNext}
                  isLast={step === quizList.length - 1}
                  index={step}
                  total={quizList.length}
                />
              : <QuizQuestion
                  quiz={quiz}
                  onSelect={handleSelect}
                  selected={selected}
                  index={step}
                  total={quizList.length}
                />
          ) : (
            <div className="text-center mt-16">
              <h2 className="text-2xl font-bold mb-4">퀴즈 완료!</h2>
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
