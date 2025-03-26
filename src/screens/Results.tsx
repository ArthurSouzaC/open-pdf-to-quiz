import {
  ArrowCounterClockwise,
  Check,
  HandTap,
  ListBullets,
  X,
} from "@phosphor-icons/react";
import { useQuiz } from "../hooks/useQuiz";
import { navigate } from "wouter/use-hash-location";

export const Results = () => {
  const { userAnswers, getQuizResult, restartQuiz, startNewQuiz } = useQuiz();

  const result = getQuizResult();

  if (!result.questions.length) {
    navigate("#");
    return <></>;
  }

  return (
    <section className="flex flex-col items-center w-full bg-zinc-800 py-12">
      <div className="w-2/5 p-4 rounded-lg">
        <span className="text-lg font-medium text-slate-50">
          Total score: {result.total.toFixed(1)}
        </span>

        {result.questions.map((item, index) => {
          return (
            <div
              className="flex flex-col mt-8 border-2 border-slate-50 rounded-lg p-4"
              key={index}
            >
              <span className="text-slate-50">
                Q{index + 1}: {item.question}
              </span>

              {item.alternatives.map((alternative, indexAlternative) => {
                const isRightAnswer =
                  item.alternatives.findIndex((item) => item.correct) ===
                  indexAlternative;

                const isUserAnswer = userAnswers[index] === indexAlternative;

                return (
                  <div
                    className="flex items-center mt-4 w-full appearance-none outline-none text-slate-50"
                    key={`${index}-${indexAlternative}`}
                  >
                    {isRightAnswer ? (
                      <Check size={24} className="text-green-500" />
                    ) : (
                      <X className="text-red-500" size={24} />
                    )}

                    <span className="ml-2 flex-1 text-sm text-start">
                      {alternative.answer}
                    </span>

                    {isUserAnswer ? (
                      <HandTap
                        className="text-slate-50"
                        size={24}
                        weight="fill"
                      />
                    ) : null}
                  </div>
                );
              })}

              <span className="text-slate-50 mt-4 font-medium">
                Score: {item.points.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-row mt-8 w-2/5">
        <button
          className="appearance-none outline-none bg-slate-50 text-zinc-800 rounded-2xl h-12 p-4 flex items-center justify-center cursor-pointer hover:opacity-75 mr-auto"
          onClick={restartQuiz}
        >
          Restart Quiz
          <ArrowCounterClockwise
            size={24}
            className="text-zinc-800 ml-2"
            weight="fill"
          />
        </button>
        <button
          className="appearance-none outline-none bg-slate-50 text-zinc-800 rounded-2xl h-12 p-4 flex items-center justify-center cursor-pointer hover:opacity-75 ml-auto"
          onClick={startNewQuiz}
        >
          Make another Quiz
          <ListBullets size={24} className="text-zinc-800 ml-2" />
        </button>
      </div>
    </section>
  );
};
