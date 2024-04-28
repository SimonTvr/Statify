import React from "react";
import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import RankingArtists from "../components/RankingArtists";
import RankingTracks from "../components/RankingTracks";
import Qqchiffres from "../components/Qqchiffres"; 
import {isLogged, musicalTastes} from "../services/spotify";
import { getTotalListeningTime } from "../services/spotify";
import "./Stats.css";

function Stats() {
  const [genres, setGenres] = useState({});
  const [totalListeningTime, setTotalListeningTime] = useState(0);

  useEffect(() => {
    musicalTastes().then(data => {
      setGenres(data);
    });
  }, []);

  useEffect(() => {
    getTotalListeningTime().then(time => {
      setTotalListeningTime(time.hours); // Utilisation uniquement des heures
    });
  }, []);
  

  const renderGenreProgress = (genreData) => {
    return Object.entries(genreData).map(([genre, percentage]) => (
      <div key={genre} className="genre-progress-container">
        <span className="genre-name">{genre}</span>
        <div className="genre-progress">
          <div className="genre-progress-bar" style={{ width: percentage }}></div>
        </div>
        <span className="genre-percentage">{percentage}</span>
      </div>
    ));
  };

  // Vérifie si l'utilisateur est connecté
  if (!isLogged()) {
    return (
      <div>
      <img src="../images/spotify2.svg" alt="Spotify Logo" className="spotify-logo2" />
      <p className="disconnected">Veuillez vous connecter pour accéder à vos statistiques.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="stats-container1">
        <div className="ranking">
          <p className="ranking-titre">Top 5 des artistes</p>
          <RankingArtists />
        </div>
        <div className="ranking">
          <p className="ranking-titre">Top 5 des titres</p>
          <RankingTracks />
        </div>
      </div>
      <p className="genre-titre">Genres préférés</p>
      <div className="genre-progress-bars">
        {renderGenreProgress(genres)}
      </div>
      <div className="qqchiffres">
      <p className="qqchiffres-titre">Quelques chiffres</p>
      <div className="qqchiffres-grid">
          <Qqchiffres title="Durée totale d'écoute" number={123} />
          <Qqchiffres title="Nombre de titres écoutés" number={456} />
          <Qqchiffres title="Nombre d'artistes écoutés" number={789} />
          <Qqchiffres title="Autre chiffre 1" number={111} />
          <Qqchiffres title="Autre chiffre 2" number={222} />
          <Qqchiffres title="Autre chiffre 3" number={333} />
      </div>
      </div>
      <div className="antiNavbar"></div>
      <Navbar />
    </div>
  );
}

export default Stats;