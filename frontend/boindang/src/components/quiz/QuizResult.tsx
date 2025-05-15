import { Quiz, QuizAnswerResult } from '../../types/api/quiz';

interface QuizResultProps {
  quiz: Quiz;
  selected: number;
  onNext: () => void;
  isLast: boolean;
  index: number;
  answerResult: QuizAnswerResult;
}

export default function QuizResult({ quiz, selected, onNext, isLast, index, answerResult }: QuizResultProps) {
    // answerResult: { correct: boolean, explanation: string }
    console.log('answerResult:', answerResult);
    console.log('quiz.options:', quiz.options);
    return (
      <div>
        <div className="text-3xl font-extrabold text-center mb-4 mt-4">Q{index + 1}</div>
        <h2 className="text-lg font-bold mb-4 text-center">{quiz.question}</h2>
        <div className="flex justify-center mb-4">
          <img
            src={answerResult?.correct ? '/assets/quiz/sugar_O.png' : '/assets/quiz/sugar_X.png'}
            alt={answerResult?.correct ? '정답' : '오답'}
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="mb-4">
          {quiz.options.map((opt, idx) => (
            <div
              key={idx}
              className={`py-3 rounded-xl border mb-2 px-3
                ${answerResult?.answer - 1 === idx ? 'border-[#6C2FF2] font-bold' : 'border-gray-200'}
                ${selected === idx ? 'bg-[#ede9fe]' : 'bg-white'}
              `}
            >
              {opt}
              {answerResult?.answer - 1 === idx && <span className="ml-2 text-[#6C2FF2]">정답</span>}
              {selected === idx && selected !== answerResult?.answer - 1 && <span className="ml-2 text-red-500">선택</span>}
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="font-semibold mb-1">{answerResult?.correct ? '정답입니다!' : '오답입니다.'}</div>
          <div className="text-sm text-gray-700">{answerResult?.explanation}</div>
        </div>
        <button
          className="w-full bg-[#ede9fe] text-[#6C2FF2] border-2 border-[#6C2FF2] py-3 rounded-xl font-bold text-lg mt-8 shadow hover:bg-[#d1c4e9] transition flex items-center justify-center gap-2"
          onClick={onNext}
        >
          {isLast ? '결과 보기' : '다음 문제'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    );
  }
  