import React from "react";
import "../CSS/DiagnosisPage.css"; // Reuse your form styles

const DiagnosisPage = ({ children }) => {
  return (
    <div className="diagnosis-container">
      <div className="form-wrapper">{children}</div>
    </div>
  );
};

export default DiagnosisPage;
