import React, { useEffect, useState } from 'react';
import QuizzButton from "./QuizzButton";
import { generateQuizQuestion } from "../services/spotify";
import "./QuizzGrid.css";

function QuizzGrid() {
  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    async function loadQuiz() {
      const quizData = await generateQuizQuestion();
      setCurrentQuiz(quizData);
    }

    loadQuiz();
  }, []);

  const handleAnswerClick = (answer) => {
    alert(answer === currentQuiz.correctAnswer ? "Correct!" : "Wrong!");
  };

  return (
    <div className="quizz-grid-container">
      <p className="quizz-question-text">{currentQuiz?.question}</p>
      <div className="quizz-answer-wrapper">
        {currentQuiz?.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswerClick(option.name)} className="quizz-button">
            <img src={option.imageUrl} alt={`Cover for ${option.name}`} className="button-icon" />
            <span className="button-text">{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizzGrid;