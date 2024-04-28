import React from "react";
import "./QuizzButton.css";

function QuizzButton({ onClick, imageUrl, text, correct }) {
  const buttonClass = correct ? 'quizz-button correct' : 'quizz-button';
  return (
    <button className={buttonClass} onClick={onClick}>
      <img src={imageUrl} alt="Icon" className="button-icon" />
      <span className="button-text">{text}</span>
    </button>
  );
}

export default QuizzButton;