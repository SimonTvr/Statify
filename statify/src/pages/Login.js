import React, { useEffect } from "react";
import LoginButton from "../components/LoginButton";
import { loginSpotify } from "../services/spotify";
import { redirectToSpotifyAuthorize, redirectUrl } from "../services/spotify";
import "./Login.css";

function Login() {
  useEffect(() => {
    const updateText = (text) => {
      let h1 = document.querySelector(".app-name");
      h1.innerHTML = text
        .split("")
        .map((letter, index) => {
          const delay = index * 70; // Augmentez ou diminuez ce délai pour ajuster l'effet de vague
          return `<span class="wavy" style="animation-delay: ${delay}ms">${letter}</span>`;
        })
        .join("");

      let logo = document.querySelector(".spotify-logo");
      logo.classList.add("wavy-logo");
    };

    updateText("Statify");
  }, []);

  // Utilise une fonction fléchée pour gérer l'événement onClick
  const handleLogin = () => {
    redirectToSpotifyAuthorize(redirectUrl);
  };

  return (
    <div>
      <div className="logo-container">
        <img
          src="../images/spotify.svg"
          alt="Spotify Logo"
          className="spotify-logo"
        />
        <p className="app-name">Statify</p>
      </div>
      <p className="app-description">
        Toutes tes statistiques concernant ta musique !
      </p>
      <div className="login-button-container">
        {/* Utilise la fonction handleLogin pour gérer l'événement onClick */}
        <LoginButton
          text="Se connecter via Spotify"
          className="login-button"
          onClick={loginSpotify}
        />
      </div>
    </div>
  );
}

export default Login;
