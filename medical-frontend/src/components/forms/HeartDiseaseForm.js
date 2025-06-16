import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../CSS/forms.css"; // Import CSS file

const HeartDiseaseForm = () => {
    const [formData, setFormData] = useState({
        Age: "",
        Sex: "",
        ChestPainType: "",
        RestingBP: "",
        Cholesterol: "",
        FastingBS: "",
        RestingECG: "",
        MaxHR: "",
        ExerciseAngina: "",
        Oldpeak: "",
        Slope: "",
        Ca: "",
        Thal: "",
    });

    const [loading, setLoading] = useState(false); // Loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading indicator
    
        // Ensure correct data formatting
        const formattedData = {
            features: {
                age: Number(formData.Age),
                sex: Number(formData.Sex),
                cp: Number(formData.ChestPainType),
                trestbps: Number(formData.RestingBP),
                chol: Number(formData.Cholesterol),
                fbs: Number(formData.FastingBS),
                restecg: Number(formData.RestingECG),
                thalach: Number(formData.MaxHR),
                exang: Number(formData.ExerciseAngina),
                oldpeak: parseFloat(formData.Oldpeak),
                slope: Number(formData.Slope),
                ca: Number(formData.Ca),
                thal: Number(formData.Thal)
            }
        };
    
        try {
            const response = await axios.post("http://localhost:5000/predict/heart_disease", 
                formattedData, // Already wrapped in "features"
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
    
            const { disease, prediction, probability } = response.data;
            navigate("/results", {
                state: {
                    disease: "Heart Disease",
                    result: prediction === 1 ? "Heart Disease Detected" : "No Heart Disease",
                    confidence: (probability[1] * 100).toFixed(2),
                    imageUrl: null,
                },
            });
        } catch (error) {
            console.error("Error submitting form", error);
            alert("Failed to send data to the server. Please try again.");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Heart Disease Diagnosis Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Age:</label>
                    <input
                        type="number"
                        name="Age"
                        value={formData.Age}
                        onChange={handleChange}
                        required
                        min="1"
                        max="120"
                    />
                </div>
                <div className="form-group">
                    <label>Sex:</label>
                    <select name="Sex" value={formData.Sex} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="0">Female</option>
                        <option value="1">Male</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Chest Pain Type:</label>
                    <select name="ChestPainType" value={formData.ChestPainType} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="0">Typical Angina</option>
                        <option value="1">Atypical Angina</option>
                        <option value="2">Non-anginal Pain</option>
                        <option value="3">Asymptomatic</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Resting Blood Pressure (mmHg):</label>
                    <input
                        type="number"
                        name="RestingBP"
                        value={formData.RestingBP}
                        onChange={handleChange}
                        required
                        min="50"
                        max="250"
                    />
                </div>
                <div className="form-group">
                    <label>Serum Cholesterol (mg/dl):</label>
                    <input
                        type="number"
                        name="Cholesterol"
                        value={formData.Cholesterol}
                        onChange={handleChange}
                        required
                        min="100"
                        max="600"
                    />
                </div>
                <div className="form-group">
                    <label>Fasting Blood Sugar (&gt;120 mg/dl):</label>
                    <select name="FastingBS" value={formData.FastingBS} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="0">No (≤120 mg/dl)</option>
                        <option value="1">Yes (&gt;120 mg/dl)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Resting ECG Results:</label>
                    <select name="RestingECG" value={formData.RestingECG} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="0">Normal</option>
                        <option value="1">ST-T Wave Abnormality</option>
                        <option value="2">Left Ventricular Hypertrophy</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Maximum Heart Rate Achieved:</label>
                    <input
                        type="number"
                        name="MaxHR"
                        value={formData.MaxHR}
                        onChange={handleChange}
                        required
                        min="50"
                        max="220"
                    />
                </div>
                <div className="form-group">
                    <label>Exercise Induced Angina:</label>
                    <select name="ExerciseAngina" value={formData.ExerciseAngina} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Oldpeak (ST Depression):</label>
                    <input
                        type="number"
                        step="0.1"
                        name="Oldpeak"
                        value={formData.Oldpeak}
                        onChange={handleChange}
                        required
                        min="0"
                        max="6.2"
                    />
                </div>
                <div className="form-group">
                    <label>Slope of Peak Exercise ST Segment:</label>
                    <select name="Slope" value={formData.Slope} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="0">Upsloping</option>
                        <option value="1">Flat</option>
                        <option value="2">Downsloping</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Number of Major Vessels (0-3):</label>
                    <input
                        type="number"
                        name="Ca"
                        value={formData.Ca}
                        onChange={handleChange}
                        required
                        min="0"
                        max="3"
                    />
                </div>
                <div className="form-group">
                    <label>Thal:</label>
                    <select name="Thal" value={formData.Thal} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="0">Normal</option>
                        <option value="1">Fixed Defect</option>
                        <option value="2">Reversible Defect</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Predicting..." : "Predict"}
                </button>
            </form>
        </div>
    );
};

export default HeartDiseaseForm;

