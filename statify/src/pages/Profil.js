import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CardScroll from "../components/CardScroll";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { isLogged, logoutSpotify, getUserData, getUserPlaylists } from "../services/spotify"; // Import de la fonction isLogged
import "./Profil.css";

function Profil() {
  const [userProfile, setUserProfile] = useState(null); // Définir userProfile avec useState
  const [userPlaylists, setUserPlaylists] = useState([]); // State pour les playlists de l'utilisateur

  useEffect(() => {
    if (isLogged()) {
      getUserData()
        .then(data => {
          setUserProfile(data);
          return getUserPlaylists(); // Récupérer les playlists de l'utilisateur
        })
        .then(playlists => {
          setUserPlaylists(playlists);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        });
    }
  }, []);

  const handleLogout = () => {
    logoutSpotify(); 
  };

  // Vérifie si l'utilisateur est connecté
  if (!isLogged()) {
    return (
      <div>
        <img src="../images/spotify2.svg" alt="Spotify Logo" className="spotify-logo2" />
        <p className="disconnected">Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-image-container">
          {userProfile && userProfile.images.length > 0 && (
            <img src={userProfile.images[0].url} alt="Profile" className="profile-image" />
          )}
        </div>
        <div className="profile-name">{userProfile ? userProfile.display_name : ''}</div>
        <Button text="MODIFIER MON PROFIL" />
        <div className="profile-info">
          <div className="profile-info-item">
            <span className="profile-nombre">{userPlaylists.length}</span>
            <span className="profile-nom">PLAYLISTS</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-nombre">{userProfile && userProfile.followers ? userProfile.followers.total : "0"}</span>
            <span className="profile-nom">ABONNÉS</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-nombre">{userProfile && userProfile.followed ? userProfile.followed.total : "0"}</span>
            <span className="profile-nom">ABONNEMENTS</span>
          </div>
        </div>
        <div className="logout-icon-container"> 
          <button className="logout-button" onClick={handleLogout}>
            <LogoutRoundedIcon className="logout-icon" /> 
          </button>        
        </div>
      </div>
      <div className="profile-playlists">
        <p className="profile-titre-playlists">Playlists</p>
        <CardScroll items={userPlaylists} /> {/* Utilisez les playlists de l'utilisateur */}
      </div>
    </div>
  );
}

export default Profil;
