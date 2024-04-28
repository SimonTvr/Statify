import React from "react";
import "./Qqchiffres.css"; // Importez le fichier CSS pour les styles de Qqchiffres

function Qqchiffres({ title, number }) {
  return (
    <div className="qqchiffres-container">
      <div className="qq-number">{number}</div>
      <div className="qq-line"></div> {/* Trait entre le chiffre et le titre */}
      <div className="qq-title">{title}</div>
    </div>
  );
}

export default Qqchiffres;
