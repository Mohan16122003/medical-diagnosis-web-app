import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../CSS/forms.css"; 
import uploadIconLight from "../../assets/upload black.png"; 
import uploadIconDark from "../../assets/upload.png"; 

const BrainTumorDiagnosisForm = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState(null);
    const [uploadIcon, setUploadIcon] = useState(uploadIconLight);
    const navigate = useNavigate();

    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains("dark");
            setUploadIcon(isDark ? uploadIconDark : uploadIconLight);
        };
        checkTheme();
        window.addEventListener("themeChange", checkTheme);
        return () => window.removeEventListener("themeChange", checkTheme);
    }, []);

    const handleImageChange = (file) => {
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // ✅ Preview Image
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError("Please upload an image first!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict/brain_tumor", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.class && response.data.confidence !== undefined) {
                const tumorType = response.data.class;
                const confidence = (response.data.confidence * 100).toFixed(2);

                // ✅ Redirect to results page with image
                navigate(`/results`, {
                    state: { 
                        disease: "Brain Tumor",
                        result: tumorType,
                        confidence: confidence,
                        imageUrl: imagePreview // ✅ Pass preview image URL
                    }
                });
            } else {
                setError("Unexpected response format from server.");
            }
        } catch (error) {
            console.error("Prediction error:", error);
            setError("Failed to process the image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Brain Tumor Detection</h2>
            <form onSubmit={handleSubmit}>
                <div 
                    className={`drop-zone ${dragging ? "dragging" : ""}`} 
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { 
                        e.preventDefault();
                        setDragging(false); 
                        handleImageChange(e.dataTransfer.files[0]); 
                    }}
                >
                    <div className="drop-zone-content">
                        <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
                        <p className="upload-text">{image ? image.name : "Drag & drop an image here or click to upload"}</p>
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e.target.files[0])} 
                    />
                </div>
                {imagePreview && (
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                    </div>
                )}
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Processing..." : "Predict"}
                </button>
            </form>
        </div>
    );
};

export default BrainTumorDiagnosisForm;
  