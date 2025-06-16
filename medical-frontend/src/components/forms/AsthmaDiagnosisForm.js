import React, { useState } from "react";
import axios from "axios";
import "../../CSS/forms.css"; // Import CSS file

const AsthmaDiagnosisForm = () => {
    const [formData, setFormData] = useState({
        Smoking: false,
        PhysicalActivity: "",
        HayFever: false,
        Eczema: false,
        FamilyHistoryAsthma: false,
        HistoryOfAllergies: false,
        PollutionExposure: "",
        PollenExposure: "",
        DustExposure: "",
        PetAllergy: false,
        Age: "",
        BMI: "",
        Gender: "",
        Wheezing: false,
        ShortnessOfBreath: false,
        ChestTightness: false,
        Coughing: false,
        NighttimeSymptoms: false,
        ExerciseInduced: false,
    });

    const [loading, setLoading] = useState(false); // Loading state

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading indicator
        try {
            const response = await axios.post("http://localhost:5000/predict", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const { prediction, likelihood } = response.data;
            alert(`Asthma Likelihood: ${likelihood}% \nDiagnosis: ${prediction === 1 ? "Asthma Detected" : "No Asthma"}`);
        } catch (error) {
            console.error("Error submitting form", error);
            alert("Failed to send data to the server. Please try again.");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Asthma Diagnosis Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Age:</label>
                    <input type="number" name="Age" value={formData.Age} onChange={handleChange} required min="5" max="80" />
                </div>
                <div className="form-group">
                    <label>Gender:</label>
                    <select name="Gender" value={formData.Gender} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="0">Male</option>
                        <option value="1">Female</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>BMI:</label>
                    <input type="number" step="0.01" name="BMI" value={formData.BMI} onChange={handleChange} required min="15" max="40" />
                </div>
                <div className="form-group">
                    <label>Physical Activity (0-10):</label>
                    <input type="number" name="PhysicalActivity" value={formData.PhysicalActivity} onChange={handleChange} required min="0" max="10" step="0.01" />
                </div>
                <div className="form-group">
                    <label>Pollution Exposure (0-10):</label>
                    <input type="number" name="PollutionExposure" value={formData.PollutionExposure} onChange={handleChange} required min="0" max="10" step="0.01" />
                </div>
                <div className="form-group">
                    <label>Pollen Exposure (0-10):</label>
                    <input type="number" name="PollenExposure" value={formData.PollenExposure} onChange={handleChange} required min="0" max="10" step="0.01" />
                </div>
                <div className="form-group">
                    <label>Dust Exposure (0-10):</label>
                    <input type="number" name="DustExposure" value={formData.DustExposure} onChange={handleChange} required min="0" max="10" step="0.01" />
                </div>
                <div className="checkbox-group">
                    <label><input type="checkbox" name="Smoking" checked={formData.Smoking} onChange={handleChange} /> Smoking</label>
                    <label><input type="checkbox" name="PetAllergy" checked={formData.PetAllergy} onChange={handleChange} /> Pet Allergy</label>
                    <label><input type="checkbox" name="FamilyHistoryAsthma" checked={formData.FamilyHistoryAsthma} onChange={handleChange} /> Family History of Asthma</label>
                    <label><input type="checkbox" name="HistoryOfAllergies" checked={formData.HistoryOfAllergies} onChange={handleChange} /> History of Allergies</label>
                    <label><input type="checkbox" name="Eczema" checked={formData.Eczema} onChange={handleChange} /> Eczema</label>
                    <label><input type="checkbox" name="HayFever" checked={formData.HayFever} onChange={handleChange} /> Hay Fever</label>
                    <label><input type="checkbox" name="Wheezing" checked={formData.Wheezing} onChange={handleChange} /> Wheezing</label>
                    <label><input type="checkbox" name="ShortnessOfBreath" checked={formData.ShortnessOfBreath} onChange={handleChange} /> Shortness of Breath</label>
                    <label><input type="checkbox" name="ChestTightness" checked={formData.ChestTightness} onChange={handleChange} /> Chest Tightness</label>
                    <label><input type="checkbox" name="Coughing" checked={formData.Coughing} onChange={handleChange} /> Coughing</label>
                    <label><input type="checkbox" name="NighttimeSymptoms" checked={formData.NighttimeSymptoms} onChange={handleChange} /> Nighttime Symptoms</label>
                    <label><input type="checkbox" name="ExerciseInduced" checked={formData.ExerciseInduced} onChange={handleChange} /> Exercise Induced</label>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Predicting..." : "Predict"}
                </button>
            </form>
        </div>
    );
};

export default AsthmaDiagnosisForm;
