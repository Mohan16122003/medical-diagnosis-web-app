import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import logo from "../assets/logo.png"; // Corrected image import
import "../CSS/Header.css";
const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Medical Diagnosis Logo" className="logo" />
        <h1 className="header-title">Medical Diagnosis</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          
        </ul>
      </nav>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark Mode" : "💡 Light Mode"}
      </button>
    </header>
  );
};
export default Header;
