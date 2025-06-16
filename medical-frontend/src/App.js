import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CardComponent from "./components/CardComponent";
import DiagnosisPage from "./components/DiagnosisPage";
import PneumoniaDiagnosisForm from "./components/forms/PneumoniaDiagnosisForm";
import BrainTumorDiagnosisForm from "./components/forms/BrainTumorDiagnosisForm";
import HeartDiseaseForm from "./components/forms/HeartDiseaseForm";
import ResultsPage from "./components/ResultsPage";
import ProfileCard from "./components/ProfileCard"; // ✅ Import ProfileCard
import "./App.css";
import EyeDiseaseDiagnosisForm from "./components/forms/EyeDiseaseDiagnosisForm";
import MalariaDiagnosisForm from "./components/forms/MalariaDiagnosisForm";
import brain from "../src/assets/Brain.png";
import eye from "../src/assets/Eye.png";
import heart from "../src/assets/Heart.png";
import pneumonia from "../src/assets/Pneumonia.png";
import mohan from "../src/assets/mohanbgremoved.png";

export const ThemeContext = createContext();

// ✅ Diagnosis Form Cards
const diagnosisForms = [
  { image:brain, title: "Brain Tumor Diagnosis", link: "/brain-tumor-form" },
  {image: eye, title: "Eye Disease Diagnosis", link: "/eye-disease-form" },
  { image: heart, title: "Heart Disease Diagnosis", link: "/heart-disease-form" },
  { image:pneumonia, title: "Pneumonia Diagnosis", link: "/pneumonia-form" },
];

// ✅ Multiple Profile Cards Data
const profiles = [
  {
    image: mohan,
    name: "Mohan Sirasapalli",
    role: "CSD Student",
    linkedin: "https://www.linkedin.com/in/mohan-sirasapalli-95333a230",
    email: "sirasapallimohan16@gmail.com",
    github: "https://github.com/Mohan16122003"
  },
  {
    image: "https://via.placeholder.com/100",
    name: "Sk. Abdul Azeez",
    role: "AI Engineer",
    linkedin: "https://linkedin.com/in/janesmith",
    email: "janesmith@example.com",
    github: "https://github.com/janesmith"
  },
  {
    image: "https://via.placeholder.com/100",
    name: "Aryan Adithya",
    role: "Data Scientist",
    linkedin: "https://linkedin.com/in/michaelbrown",
    email: "michaelbrown@example.com",
    github: "https://github.com/michaelbrown"
  },
  {
    image: "https://via.placeholder.com/100",
    name: "N.Sai Praveen",
    role: "ML Engineer",
    linkedin: "https://linkedin.com/in/emmadavis",
    email: "emmadavis@example.com",
    github: "https://github.com/emmadavis"
  },
  {
    image: "https://via.placeholder.com/100",
    name: "Naga Muni Reddy",
    role: "Cloud Architect",
    linkedin: "https://linkedin.com/in/sophialee",
    email: "reddybnagamuni@gmail.com",
    github: "https://github.com/sophialee"
  },
  {
    image: "https://via.placeholder.com/100",
    name: "Kishore",
    role: "Cybersecurity Expert",
    linkedin: "https://linkedin.com/in/danielwhite",
    email: "kishuboddani@gmail.com",
    github: "https://github.com/danielwhite"
  },
  {
    image: "https://via.placeholder.com/100",
    name: "V.Lokesh",
    role: "DevOps Engineer",
    linkedin: "https://linkedin.com/in/alicejohnson",
    email: "rajanlokesh961@gmail.com",
    github: "https://github.com/alicejohnson"
  }
];

const App = () => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <div className="app-container">
                <h1 className="title">Select a Diagnosis</h1>
                <div className="card-grid">
                  {diagnosisForms.map((form, index) => (
                    <CardComponent key={index} project={form} />
                  ))}
                </div>

                {/* ✅ Profile Cards Below the Diagnosis Cards */}
                <h2 className="title">Meet the Team</h2>
                <div className="profile-grid">
                  {profiles.map((profile, index) => (
                    <ProfileCard key={index} profile={profile} />
                  ))}
                </div>
              </div>
            }
          />
          <Route path="/brain-tumor-form" element={<DiagnosisPage><BrainTumorDiagnosisForm /></DiagnosisPage>} />
          <Route path="/eye-disease-form" element={<DiagnosisPage><EyeDiseaseDiagnosisForm /></DiagnosisPage>} />
          <Route path="/pneumonia-form" element={<DiagnosisPage><PneumoniaDiagnosisForm /></DiagnosisPage>} />
          <Route path="/heart-disease-form" element={<DiagnosisPage><HeartDiseaseForm /></DiagnosisPage>} />
          <Route path="/malaria-disease-form" element={<DiagnosisPage><MalariaDiagnosisForm /></DiagnosisPage>} />
          {/* Results Page Route */}
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;
