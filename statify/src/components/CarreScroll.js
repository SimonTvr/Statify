import React from "react";
import Carre from "./Carre"; // Importez le composant Carre
import "./CarreScroll.css"; // Importez les styles CSS

function CarreScroll({ recommendedTracks }) {
  // Vérifiez si recommendedTracks est null, auquel cas, utilisez une liste vide
  const tracks = recommendedTracks || [];

  return (
    <div className="carre-scroll-container">
      <div className="carre-scroll">
        {/* Utilisez la liste des musiques recommandées pour générer les éléments Carre */}
        {tracks.map((track, index) => (
          <Carre key={index}>
            <img src={track.imageUrl} alt="Icon" className="carre-image" />
            <span className="carre-text1">{track.title}</span>
            <span className="carre-text2">{track.artist}</span>
          </Carre>
        ))}
      </div>
    </div>
  );
}

export default CarreScroll;
