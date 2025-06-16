from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import pickle
import os
import logging
from flask_cors import CORS
from tensorflow.keras.models import load_model
from xgboost import XGBClassifier
import pandas as pd

# Enable logging for debugging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Define model paths
BASE_DIR = r"C:\Users\siras\OneDrive\Documents\Study\WOW\Website\backend\models"

MODELS_CONFIG = {
    "pneumonia": {"model_path": "pneumonia_model.h5", "class_indices": "pneumonia_class_indices.pkl"},
    "brain_tumor": {"model_path": "Model Final Brain Tumor.h5", "class_indices": "class_indices.pkl"},
    "heart_disease": {
        "model_path": "heart_disease_xgb.pkl",
        "scaler": "scaler.pkl",
        "features": "heart_disease_features.pkl"
    },
    "malaria": {"model_path": "malaria_model.h5", "class_indices": "malaria_class_indices.pkl"}  # NEW
}

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load models and class indices once
models = {}
class_indices = {}
scalers = {}
feature_orders = {}

def load_heart_disease_model():
    """Loads heart disease model, scaler, and feature order."""
    try:
        logging.info("Loading heart disease model...")
        with open(os.path.join(BASE_DIR, MODELS_CONFIG["heart_disease"]["model_path"]), "rb") as f:
            models["heart_disease"] = pickle.load(f)

        with open(os.path.join(BASE_DIR, MODELS_CONFIG["heart_disease"]["scaler"]), "rb") as f:
            scalers["heart_disease"] = pickle.load(f)

        with open(os.path.join(BASE_DIR, MODELS_CONFIG["heart_disease"]["features"]), "rb") as f:
            feature_orders["heart_disease"] = pickle.load(f)

        logging.info("Heart disease model, scaler, and features loaded successfully!")
    except Exception as e:
        logging.error(f"Error loading heart disease model: {e}")

def load_image_models():
    """Loads pneumonia, brain tumor, and malaria models along with class indices."""
    for disease, config in MODELS_CONFIG.items():
        if disease == "heart_disease":
            continue  # Skip heart disease, as it requires a different loading method
        try:
            logging.info(f"Loading {disease} model...")
            models[disease] = load_model(os.path.join(BASE_DIR, config["model_path"]))

            with open(os.path.join(BASE_DIR, config["class_indices"]), "rb") as f:
                class_dict = pickle.load(f)
            class_indices[disease] = sorted(class_dict, key=class_dict.get)

            logging.info(f"{disease} model and class indices loaded successfully!")
        except Exception as e:
            logging.error(f"Error loading {disease} model or class indices: {e}")

# Load models at startup
load_heart_disease_model()
load_image_models()

# Preprocessing functions
def preprocess_pneumonia_image(image):
    """Preprocesses an image for pneumonia prediction to match training pipeline."""
    try:
        image = image.convert("RGB").resize((224, 224))
        image = np.array(image, dtype=np.float32) / 255.0
        return np.expand_dims(image, axis=0)
    except Exception as e:
        logging.error(f"Error in pneumonia image preprocessing: {e}")
        return None

def preprocess_brain_tumor_image(image):
    """Preprocesses an image for brain tumor prediction."""
    try:
        image = image.convert("RGB").resize((224, 224))
        image = np.array(image, dtype=np.float32) / 255.0
        return np.expand_dims(image, axis=0)
    except Exception as e:
        logging.error(f"Error in brain tumor image preprocessing: {e}")
        return None

def preprocess_malaria_image(image):
    """Preprocesses an image for malaria detection, matching training preprocessing."""
    try:
        # Convert PIL image to OpenCV format (NumPy array)
        image = np.array(image.convert("RGB"))

        # Resize to match model input
        image = cv2.resize(image, (120, 120))

        # Sharpen the image (using two different kernels for different classes)
        kernel = np.array([[0, -1, 0], [-1, 6, -1], [0, -1, 0]])  # Default for parasitized
        image = cv2.filter2D(image, -1, kernel)

        # Convert to YUV and apply histogram equalization on Y-channel (brightness)
        image_yuv = cv2.cvtColor(image, cv2.COLOR_BGR2YUV)
        image_yuv[:, :, 0] = cv2.equalizeHist(image_yuv[:, :, 0])
        image = cv2.cvtColor(image_yuv, cv2.COLOR_YUV2RGB)

        # Normalize pixel values
        image = image.astype(np.float32) / 255.0

        # Expand dimensions for model input
        return np.expand_dims(image, axis=0)

    except Exception as e:
        logging.error(f"Error in malaria image preprocessing: {e}")
        return None
def preprocess_heart_disease(data):
    """Preprocess input data for heart disease prediction."""
    try:
        features = data.get("features")
        if not isinstance(features, dict):
            raise ValueError("Features must be a dictionary with correct feature names.")

        missing_features = [f for f in feature_orders["heart_disease"] if f not in features]
        if missing_features:
            raise ValueError(f"Missing features: {missing_features}")

        ordered_features = [features[feature] for feature in feature_orders["heart_disease"]]
        features_array = np.array(ordered_features).reshape(1, -1)
        features_scaled = scalers["heart_disease"].transform(features_array)

        return features_scaled
    except Exception as e:
        logging.error(f"Error in heart disease preprocessing: {e}")
        return None

# Prediction functions
def make_prediction(disease, processed_image):
    """Handles model prediction for pneumonia, brain tumor, and malaria."""
    if processed_image is None:
        return jsonify({"error": "Image processing failed"}), 500

    if disease not in models or models[disease] is None:
        return jsonify({"error": f"Model for {disease} not loaded"}), 500

    if disease not in class_indices or not class_indices[disease]:
        return jsonify({"error": f"Class indices for {disease} not loaded"}), 500

    prediction = models[disease].predict(processed_image)[0]
    predicted_class = class_indices[disease][np.argmax(prediction)]
    confidence = float(np.max(prediction))

    return jsonify({
        "disease": disease,
        "class": predicted_class,
        "confidence": confidence
    })

def make_heart_disease_prediction(processed_data):
    """Handles heart disease prediction using XGBoost."""
    if processed_data is None:
        return jsonify({"error": "Invalid input data"}), 500

    if "heart_disease" not in models or models["heart_disease"] is None:
        return jsonify({"error": "Heart disease model not available"}), 500

    prediction = models["heart_disease"].predict(processed_data)[0]
    probability = models["heart_disease"].predict_proba(processed_data)[0].tolist()

    return jsonify({
        "disease": "heart_disease",
        "prediction": int(prediction),
        "probability": probability
    })

# Flask API Routes
@app.route('/predict/pneumonia', methods=['POST'])
def predict_pneumonia_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image = Image.open(io.BytesIO(request.files['image'].read()))
    return make_prediction("pneumonia", preprocess_pneumonia_image(image))

@app.route('/predict/brain_tumor', methods=['POST'])
def predict_brain_tumor_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image = Image.open(io.BytesIO(request.files['image'].read()))
    return make_prediction("brain_tumor", preprocess_brain_tumor_image(image))

@app.route('/predict/malaria', methods=['POST'])
def predict_malaria_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image = Image.open(io.BytesIO(request.files['image'].read()))
    return make_prediction("malaria", preprocess_malaria_image(image))

@app.route('/predict/heart_disease', methods=['POST'])
def predict_heart_disease_api():
    data = request.get_json()
    return make_heart_disease_prediction(preprocess_heart_disease(data))

if __name__ == '__main__':
    logging.info("Starting Flask server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
