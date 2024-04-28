import React from "react";
import { createRoot } from "react-dom/client"; // Importe createRoot depuis react-dom/client
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Accueil from './pages/Accueil';
import Stats from './pages/Stats';
import Profil from './pages/Profil';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/pages/Welcome",
    element: <Welcome/>,
  },
  {
    path: "/pages/Accueil",
    element: <Accueil/>,
  },
  {
    path: "/pages/Stats",
    element: <Stats/>,
  },
  {
    path: "/pages/Profil",
    element: <Profil/>,
  },
]);

const root = createRoot(document.getElementById("root")); // Utilise createRoot pour créer ton arbre de rendu
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
