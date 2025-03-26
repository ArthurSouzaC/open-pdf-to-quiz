import { atom, useAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { navigate } from "wouter/use-hash-location";

interface Alternative {
  answer: string;
  correct: boolean;
}

interface Question {
  question: string;
  alternatives: Alternative[];
}

const CORRECT_ANSWER_POINTS = 1;
const WRONG_ANSWER_POINTS = 0;

export const questionsAtom = atom<Question[]>([]);

export const userAnswersAtom = atom<Record<number, number>>({});

export const useQuiz = () => {
  const [userAnswers, setUserAnswers] = useAtom(userAnswersAtom);
  const [questions, setQuestions] = useAtom(questionsAtom);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const previousQuestion = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const setupQuestions = (questionsJson: Question[]) => {
    if (questionsJson.length) {
      setQuestions(questionsJson);
      navigate("#quiz");
      throw new Error("JSON without questions");
    }
  };

  const answerQuestion = (indexQuestion: number, indexAnswer: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [indexQuestion]: indexAnswer,
    }));
  };

  const finishQuiz = () => {
    const nonAnsweredIndex = questions.findIndex(
      (_, index) => userAnswers[index] === undefined
    );

    if (nonAnsweredIndex === -1) {
      navigate("#results");
    } else {
      setCurrentQuestionIndex(nonAnsweredIndex);
      toast.warn("You need to answer all the questions!");
    }
  };

  const getQuizResult = () => {
    let total: number = 0;

    const result = {
      questions: questions.map((item, index) => {
        const userAnswer = userAnswers[index];
        const points =
          item.alternatives.findIndex((item) => item.correct) ===
          userAnswers[index]
            ? CORRECT_ANSWER_POINTS
            : WRONG_ANSWER_POINTS;

        total += points;

        return {
          ...item,
          userAnswer,
          points,
        };
      }),
      total,
    };

    return result;
  };

  const restartQuiz = () => {
    navigate("#quiz");
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  };

  const startNewQuiz = () => {
    navigate("#");
    setQuestions([]);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  };

  return {
    questions,
    userAnswers,
    currentQuestionIndex,
    setupQuestions,
    answerQuestion,
    getQuizResult,
    previousQuestion,
    nextQuestion,
    finishQuiz,
    restartQuiz,
    startNewQuiz,
  };
};
