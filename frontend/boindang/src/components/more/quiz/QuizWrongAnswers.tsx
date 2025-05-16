import type { WrongAnswer } from '@/types/api/more/quiz';

interface QuizWrongAnswersProps {
  answers: WrongAnswer[];
  isCorrect: boolean;
}

export default function QuizWrongAnswers({ answers, isCorrect }: QuizWrongAnswersProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">
        {isCorrect ? '맞힌 문제' : '틀린 문제'} ({answers.length})
      </h2>
      {answers.map((item) => (
        <div key={item.quizId} className="bg-white rounded-xl p-4 shadow-sm">
          <p className="font-medium mb-2">Q. {item.question}</p>
          <div className="space-y-1 mb-3">
            {item.options.map((option, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg text-sm ${
                  index + 1 === item.answerId
                    ? 'bg-green-100 text-green-800' 
                    : index + 1 === item.selectedId && !item.isCorrect
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100'
                }`}
              >
                {option} 
                {index + 1 === item.answerId && ' (정답)'}
                {index + 1 === item.selectedId && !item.isCorrect && ' (내 선택)'}
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{item.explanation}</p>
            {!item.isCorrect && (
              <p className="text-sm text-red-700 mt-2">{item.selectedExplanation}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 