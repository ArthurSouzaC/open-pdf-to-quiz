import {
  ArrowFatLeft,
  ArrowFatRight,
  CheckFat,
  RadioButton,
} from "@phosphor-icons/react";
import { useQuiz } from "../hooks/useQuiz";
import { ToastContainer } from "react-toastify";
import { navigate } from "wouter/use-hash-location";

export const Quiz = () => {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    finishQuiz,
  } = useQuiz();

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    navigate("#");
    return <></>;
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen w-full bg-zinc-800">
      <ToastContainer />

      <div className="w-2/5 p-4 border border-slate-50 rounded-lg">
        <span className="text-slate-50 font-medium">
          Q{currentQuestionIndex + 1}: {currentQuestion.question}
        </span>
        <div className="flex flex-col w-full mt-4">
          {currentQuestion.alternatives.map((alternative, index) => {
            const selected = userAnswers[currentQuestionIndex] === index;

            return (
              <button
                key={index}
                className="flex items-center mt-4 w-full appearance-none outline-none cursor-pointer text-slate-50 hover:text-slate-300"
                onClick={() => answerQuestion(currentQuestionIndex, index)}
              >
                <RadioButton size={24} weight={selected ? "fill" : "regular"} />

                <span
                  className={`ml-2 flex-1 text-sm text-start ${
                    selected ? "font-medium" : "font-regular"
                  }`}
                >
                  {alternative.answer}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row mt-8 w-2/5">
        {currentQuestionIndex > 0 && (
          <button
            className="appearance-none outline-none bg-slate-50 text-zinc-800 rounded-2xl h-12 p-4 flex items-center justify-center cursor-pointer hover:opacity-75 mr-auto"
            onClick={previousQuestion}
          >
            <ArrowFatLeft size={24} className="text-zinc-800" weight="fill" />
          </button>
        )}
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            className="appearance-none outline-none bg-slate-50 text-zinc-800 rounded-2xl h-12 p-4 flex items-center justify-center cursor-pointer hover:opacity-75 ml-auto"
            onClick={nextQuestion}
          >
            <ArrowFatRight size={24} className="text-zinc-800" weight="fill" />
          </button>
        ) : (
          <button
            className="appearance-none outline-none bg-slate-50 text-zinc-800 rounded-2xl h-12 p-4 flex items-center justify-center cursor-pointer hover:opacity-75 ml-auto"
            onClick={finishQuiz}
          >
            Finish Quiz
            <CheckFat size={24} className="text-zinc-800 ml-2" weight="fill" />
          </button>
        )}
      </div>
    </section>
  );
};
