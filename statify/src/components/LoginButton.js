import React from "react";
import "./LoginButton.css";

function LoginButton({ text, onClick }) {
  return (
    <button className="login-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default LoginButton;
