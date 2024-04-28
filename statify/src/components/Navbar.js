import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from '@mui/icons-material/HomeRounded';
import BarChartIcon from '@mui/icons-material/BarChartRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/pages/Accueil" className="nav-link">
            <HomeIcon
              className={location.pathname === "/" ? "active-icon" : ""}
            />
            <span className={location.pathname === "/" ? "active-text" : ""}>
              Accueil
            </span>
          </Link>
        </li>
        <li
          className={`nav-item ${
            location.pathname === "/pages/stats" ? "active" : ""
          }`}
        >
          <Link to="/pages/stats" className="nav-link">
            <BarChartIcon
              className={
                location.pathname === "/pages/stats" ? "active-icon" : ""
              }
            />
            <span
              className={
                location.pathname === "/pages/stats" ? "active-text" : ""
              }
            >
              Stats
            </span>
          </Link>
        </li>
        <li
          className={`nav-item ${
            location.pathname === "/pages/profil" ? "active" : ""
          }`}
        >
          <Link to="/pages/profil" className="nav-link">
            <PersonIcon
              className={
                location.pathname === "/pages/profil" ? "active-icon" : ""
              }
            />
            <span
              className={
                location.pathname === "/pages/profil" ? "active-text" : ""
              }
            >
              Profil
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
