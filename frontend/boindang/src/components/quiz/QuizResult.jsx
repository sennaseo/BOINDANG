export default function QuizResult({ quiz, selected, onNext, isLast, index }) {
    const isCorrect = selected === quiz.answer;
    return (
      <div>
        <div className="text-2xl font-extrabold text-center mb-4">Q{index + 1}</div>
        <h2 className="text-lg font-bold mb-4 text-center">{quiz.question}</h2>
        <div className="flex justify-center mb-4">
          <img
            src={isCorrect ? '/assets/quiz/sugar_O.png' : '/assets/quiz/sugar_X.png'}
            alt={isCorrect ? '정답' : '오답'}
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="mb-4">
          {quiz.options.map(opt => (
            <div
              key={opt.key}
              className={`py-3 rounded-xl border mb-2 px-3
                ${quiz.answer === opt.key ? 'border-[#6C2FF2] font-bold' : 'border-gray-200'}
                ${selected === opt.key ? 'bg-[#ede9fe]' : 'bg-white'}
              `}
            >
              {opt.key}. {opt.text}
              {quiz.answer === opt.key && <span className="ml-2 text-[#6C2FF2]">정답</span>}
              {selected === opt.key && selected !== quiz.answer && <span className="ml-2 text-red-500">선택</span>}
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="font-semibold mb-1">{isCorrect ? '정답입니다!' : '오답입니다.'}</div>
          <div className="text-sm text-gray-700">{quiz.explanation}</div>
        </div>
        <button
          className="w-full bg-[#6C2FF2] text-white py-3 rounded-xl font-semibold"
          onClick={onNext}
        >
          {isLast ? '결과 보기' : '다음 문제'}
        </button>
      </div>
    );
  }
  