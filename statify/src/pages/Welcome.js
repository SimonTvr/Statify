import React, { useState, useEffect } from 'react';
import LoginButton from "../components/LoginButton";
import './Welcome.css';
import { Link } from 'react-router-dom';
import { getUserData, isLogged } from "../services/spotify";

function Welcome() {
  const [userName, setUserName] = useState(""); // État pour stocker le nom de l'utilisateur

  useEffect(() => {
    // Vérifie d'abord si l'utilisateur est connecté
    if (isLogged()) {
      // Récupère les données de l'utilisateur depuis l'API Spotify
      getUserData()
        .then(data => {
          // Met à jour le nom de l'utilisateur dans l'état
          setUserName(data.display_name);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        });
    }
  }, []);

  return (
    <div className="welcome-container">
      <p className="welcome-text">
        {`Bienvenue ${userName || ''}`}
      </p>
      <div className="welcome-button">
        <Link to="/pages/Accueil">
          <LoginButton text="Accéder à mes statistiques" className="welcome-button" /> 
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
