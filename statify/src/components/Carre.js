import React from "react";
import "./Carre.css";

function Carre({ onClick, children }) {
  return (
    <button className="carre" onClick={onClick}>
    <img src="../images/dualipa.jpeg" alt="Icon" className="carre-image" />
      <span className="carre-text">{children}</span>
    </button>
  );
}

export default Carre;
