export default function QuizQuestion({ quiz, onSelect, selected, index  }) {
    return (
      <div>
        <div className="text-3xl font-extrabold text-center mb-4">Q{index + 1}</div>
        <h2 className="text-lg font-bold mb-4 text-center">{quiz.question}</h2>
        <div className="flex flex-col gap-3">
          {quiz.options.map(opt => (
            <button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
              className={`py-3 rounded-xl border ${selected === opt.key ? 'bg-[#6C2FF2] text-white' : 'bg-white text-gray-800'} font-semibold`}
              disabled={!!selected}
            >
              {opt.key}. {opt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }
  