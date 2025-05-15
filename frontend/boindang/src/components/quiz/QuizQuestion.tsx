import { Quiz } from '../../types/api/quiz';

interface QuizQuestionProps {
  quiz: Quiz;
  onSelect: (index: number) => void;
  selected: number | null;
  onSubmit: () => void;
  index: number;
}

export default function QuizQuestion({ quiz, onSelect, selected, onSubmit, index }: QuizQuestionProps) {
  console.log('POST 요청 quizId:', quiz.quizId, 'selected:', selected, 'options:', quiz.options);
  console.log('선택한 보기:', selected !== null ? quiz.options[selected] : '선택 안됨');

  return (
    <div>
      <div className="text-3xl font-extrabold text-center mb-2 mt-4">Q{index + 1}</div>
      <div className="text-base font-bold text-center mb-4 text-black">[{quiz.title}]</div>
      <h2 className="text-lg font-bold text-center mb-4">{quiz.question}</h2>
      <div className="flex flex-col gap-3">
        {quiz.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`py-3 rounded-xl border ${selected === idx ? 'bg-[#6C2FF2] text-white' : 'bg-white text-gray-800'} font-semibold`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        className="w-full bg-[#6C2FF2] text-white py-3 rounded-xl font-bold text-lg mt-8 shadow hover:bg-[#4B1DBA] transition flex items-center justify-center gap-2"
        onClick={onSubmit}
        disabled={selected === null}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        정답 제출
      </button>
    </div>
  );
}
  