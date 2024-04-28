import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import "./Accueil.css";
import QuizzGrid from "../components/QuizzGrid";
import CarreScroll from "../components/CarreScroll";
import { isLogged, getUserData, getRecommendations } from "../services/spotify"; // Importez les questions et la fonction loadArtistImages
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Link } from 'react-router-dom'; 
import { questions } from "../services/Quizz";



function Accueil() {
  const [userName, setUserName] = useState("");
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  useEffect(() => {
    if (isLogged()) {
      getUserData()
        .then(data => {
          setUserName(data.display_name);
          return getRecommendations();
        })
        .then(tracks => {
          setRecommendedTracks(tracks);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        });
    }
  }, []);

  // Gérez la sélection de la réponse
  const onSelectAnswer = (answer) => {
    // Faites quelque chose avec la réponse sélectionnée
    console.log("Réponse sélectionnée :", answer);
  };

  if (!isLogged()) {
    return (
      <div>
        <img src="../images/spotify2.svg" alt="Spotify Logo" className="spotify-logo2" />
        <p className="disconnected">Veuillez vous connecter pour accéder à Statify.</p>
        <Link to="/" className="return-link">
          <KeyboardBackspaceRoundedIcon className="return-icon" /> 
        </Link>
      </div>
    );
  }

  return (
    <div className="accueil-container">
      <p className="accueil-text">Bonjour {userName}</p>
      <div className="accueil-quizz">
        <p className="accueil-titre-quizz">Question du jour</p>
        <div className="question-line"></div>
        <QuizzGrid questions={questions} onSelectAnswer={onSelectAnswer} />
        <p className="accueil-titre-recommandees">Musiques recommandées</p>
        <CarreScroll recommendedTracks={recommendedTracks} />
      </div>
      <div className="antiNavbar"></div>
      <Navbar />
    </div>
  );
}

export default Accueil;