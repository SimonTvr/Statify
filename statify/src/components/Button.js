import React from 'react';
import './Button.css';

function Button({ text, onClick, className }) {
  // Ajoutez la classe supplémentaire à la liste de classes du bouton
  const buttonClass = `button ${className}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
