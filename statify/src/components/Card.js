import React from "react";
import "./Card.css";

function Card({ onClick, imageUrl, text1, text2, text2Prefix }) {
  return (
    <button className="card" onClick={onClick}>
      <img src={imageUrl} alt="Icon" className="card-icon" />
      <div className="card-text-container">
        <span className="card-text1">{text1}</span>
        <span className="card-text2">{text2} {text2Prefix}</span>
      </div>
    </button>
  );
}

export default Card;
