import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../CSS/results.css";

const ResultsPage = () => {
    const location = useLocation();
    const { disease, result, confidence, imageUrl } = location.state || {};

    const [specialists, setSpecialists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState("India");

    useEffect(() => {
        const getUserLocationAndFetchSpecialists = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                            );
                            const data = await response.json();
                            const city = data.address.city || data.address.town || data.address.state || "India";
                            setUserLocation(city);
                            fetchNearbySpecialists(disease, city);
                        } catch (err) {
                            console.warn("Reverse geocoding failed. Falling back to default location.");
                            fetchNearbySpecialists(disease, "India");
                        }
                    },
                    (error) => {
                        console.warn("Geolocation denied. Falling back to default location.");
                        fetchNearbySpecialists(disease, "India");
                    }
                );
            } else {
                console.warn("Geolocation not supported. Using default location.");
                fetchNearbySpecialists(disease, "India");
            }
        };
    
        if (disease) {
            getUserLocationAndFetchSpecialists();
        }
    }, [disease]);
    

    
    const fetchNearbySpecialists = async (disease, location = "India") => {
        try {
            const response = await fetch(`/api/get-specialists?disease=${encodeURIComponent(disease)}&location=${encodeURIComponent(location)}`);
            if (!response.ok) throw new Error("Failed to fetch specialists");
            const data = await response.json();
            setSpecialists(data.specialists || []);
        } catch (error) {
            console.error("Error fetching specialists:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="results-container">
            <h2>{disease} Diagnosis</h2>

            {imageUrl && (
                <div className="image-preview">
                    <img src={imageUrl} alt="Uploaded" className="preview-img" />
                </div>
            )}

            <div className="results-content">
                <div className="progress-circle">
                    <svg width="300" height="300" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" className="bg" />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            className="progress"
                            style={{
                                strokeDashoffset: 314 - (314 * confidence) / 100
                            }}
                        />
                    </svg>
                    <p className="percentage">{confidence}%</p>
                </div>

                <div className="diagnosis-container">
                    <p className="result-heading">Result</p>
                    <p className="result-prediction">{result}</p>
                </div>
            </div>

            <div className="specialists">
                <h3>Nearby Specialists {userLocation && `in ${userLocation}`}</h3>
                {loading ? (
                    <p>Fetching nearby specialists...</p>
                ) : specialists.length > 0 ? (
                    <ul>
                        {specialists.map((specialist, index) => (
                            <li key={index}>
                                <strong>{specialist.name}</strong> - {specialist.specialty}
                                <br />
                                <span>{specialist.location}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No specialists found in your area.</p>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
