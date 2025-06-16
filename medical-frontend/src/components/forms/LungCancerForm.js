import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../CSS/forms.css"; // Make sure this matches your style

const LungCancerForm = () => {
    const [formData, setFormData] = useState({
        Age: "",
        Gender: "",
        Smoking: "",
        YellowFingers: "",
        Anxiety: "",
        PeerPressure: "",
        ChronicDisease: "",
        Fatigue: "",
        Allergy: "",
        Wheezing: "",
        AlcoholConsumption: "",
        Coughing: "",
        ShortnessOfBreath: "",
        SwallowingDifficulty: "",
        ChestPain: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formattedData = {
            features: {
                age: Number(formData.Age),
                gender: Number(formData.Gender),
                smoking: Number(formData.Smoking),
                yellow_fingers: Number(formData.YellowFingers),
                anxiety: Number(formData.Anxiety),
                peer_pressure: Number(formData.PeerPressure),
                chronic_disease: Number(formData.ChronicDisease),
                fatigue: Number(formData.Fatigue),
                allergy: Number(formData.Allergy),
                wheezing: Number(formData.Wheezing),
                alcohol_consuming: Number(formData.AlcoholConsumption),
                coughing: Number(formData.Coughing),
                shortness_of_breath: Number(formData.ShortnessOfBreath),
                swallowing_difficulty: Number(formData.SwallowingDifficulty),
                chest_pain: Number(formData.ChestPain),
            },
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/predict/lung_cancer",
                formattedData,
                { headers: { "Content-Type": "application/json" } }
            );

            const { prediction, probability } = response.data;

            navigate("/results", {
                state: {
                    disease: "Lung Cancer",
                    result: prediction === 1 ? "Lung Cancer Detected" : "No Lung Cancer",
                    confidence: (probability[1] * 100).toFixed(2),
                    imageUrl: null,
                },
            });
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to send data to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Lung Cancer Diagnosis Form</h2>
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
                    <label>Gender:</label>
                    <select name="Gender" value={formData.Gender} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="1">Male</option>
                        <option value="0">Female</option>
                    </select>
                </div>

                {[
                    ["Smoking", "Smoking Habit"],
                    ["YellowFingers", "Yellow Fingers"],
                    ["Anxiety", "Anxiety"],
                    ["PeerPressure", "Peer Pressure"],
                    ["ChronicDisease", "Chronic Disease"],
                    ["Fatigue", "Fatigue"],
                    ["Allergy", "Allergy"],
                    ["Wheezing", "Wheezing"],
                    ["AlcoholConsumption", "Alcohol Consumption"],
                    ["Coughing", "Coughing"],
                    ["ShortnessOfBreath", "Shortness of Breath"],
                    ["SwallowingDifficulty", "Swallowing Difficulty"],
                    ["ChestPain", "Chest Pain"],
                ].map(([name, label]) => (
                    <div className="form-group" key={name}>
                        <label>{label}:</label>
                        <select name={name} value={formData[name]} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>
                ))}

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Predicting..." : "Predict"}
                </button>
            </form>
        </div>
    );
};

export default LungCancerForm;
