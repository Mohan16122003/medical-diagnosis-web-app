from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io
import pickle
import os
import logging
from flask_cors import CORS
from tensorflow.keras.models import load_model
from xgboost import XGBClassifier
import pandas as pd
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
BASE_DIR = r"C:\Users\siras\OneDrive\Documents\Study\WOW\Website\backend\models"
MODELS_CONFIG = {
    "pneumonia": {"model_path": "pneumonia_model (5).h5", "class_indices": "pneumonia_class_indices (3).pkl"},
    "brain_tumor": {"model_path": "Model Final Brain Tumor.h5", "class_indices": "class_indices.pkl"},
    "heart_disease": {
        "model_path": "heart_disease_xgb.pkl",
        "scaler": "scaler.pkl",
        "features": "heart_disease_features.pkl"
    },
    "diabetes": {
    "model_path": "diabetes_model (1).pkl",
        "scaler": "diabetes_scaler (1).pkl",
        "features": "diabetes_features (1).pkl"
},
    "lung_cancer": {
        "model_path": "Lung_cancer_model.pkl",
        "scaler": "lung_cancer_scaler.pkl",
        "features": "lung_cancer_features.pkl"
    },
    "eye_disease": {"model_path": "eye_disease_model_transfer.h5", "class_indices": "eye_disease_class_indices.pkl"},
    "malaria": {"model_path": "malaria_model (1).h5", "class_indices": "malaria_class_indices.pkl"}
}
app = Flask(__name__)
CORS(app)
models = {}
class_indices = {}
scalers = {}
feature_orders = {}
def load_diabetes_model():
    try:
        logging.info("Loading diabetes model and scaler...")
        with open(os.path.join(BASE_DIR, MODELS_CONFIG["diabetes"]["model_path"]), "rb") as f:
            models["diabetes"] = pickle.load(f)
        with open(os.path.join(BASE_DIR, MODELS_CONFIG["diabetes"]["scaler_path"]), "rb") as f:
            scalers["diabetes"] = pickle.load(f)
        feature_orders["diabetes"] = MODELS_CONFIG["diabetes"]["features"]
        logging.info("Diabetes model and scaler loaded successfully!")
    except Exception as e:
        logging.error(f"Error loading diabetes model or scaler: {e}")
def load_heart_disease_model():
    try:
        logging.info("Loading heart disease model...")
        with open(os.path.join(BASE_DIR, MODELS_CONFIG["heart_disease"]["model_path"]), "rb") as f:
            models["heart_disease"] = pickle.load(f)
        with open(os.path.join(BASE_DIR, MODELS_CONFIG["heart_disease"]["scaler"]), "rb") as f:
            scalers["heart_disease"] = pickle.load(f)
        with open(os.path.join(BASE_DIR, MODELS_CONFIG["heart_disease"]["features"]), "rb") as f:
            feature_orders["heart_disease"] = pickle.load(f)
        logging.info("Heart disease model loaded successfully!")
    except Exception as e:
        logging.error(f"Error loading heart disease model: {e}")
def load_lung_cancer_model():
    try:
        with open(os.path.join(BASE_DIR, MODELS_CONFIG["lung_cancer"]["model"]), "rb") as f:
            models["lung_cancer"] = pickle.load(f)
        logging.info("[Lung Cancer] Model loaded successfully.")
    except Exception as e:
        logging.error(f"[Lung Cancer] Model loading failed: {e}")

def load_image_models():
    for disease, config in MODELS_CONFIG.items():
        if disease == "heart_disease" or disease == "lung_cancer":
            continue
        try:
            logging.info(f"Loading {disease} model...")
            models[disease] = load_model(os.path.join(BASE_DIR, config["model_path"]), compile=False)
            with open(os.path.join(BASE_DIR, config["class_indices"]), "rb") as f:
                class_dict = pickle.load(f)
            class_indices[disease] = sorted(class_dict, key=class_dict.get)
            logging.info(f"{disease} model loaded successfully!")
        except Exception as e:
            logging.error(f"Error loading {disease} model: {e}")
load_heart_disease_model()
load_lung_cancer_model()
load_diabetes_model()
load_image_models()
def preprocess_diabetes(data):
    try:
        features = data.get("features")
        if not isinstance(features, dict):
            raise ValueError("Features must be a dictionary.")
        ordered_features = [features[f] for f in feature_orders["diabetes"]]
        array = np.array(ordered_features).reshape(1, -1)
        scaled = scalers["diabetes"].transform(array)
        return scaled
    except Exception as e:
        logging.error(f"Error in diabetes preprocessing: {e}")
        return None
def preprocess_image(image_data):
    try:
        img = Image.open(io.BytesIO(image_data)).convert("L")
        img = img.resize((224, 224))
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = img_array.reshape(1, 224, 224, 1)
        return img_array
    except Exception as e:
        import traceback
        logging.error(f"Error processing image: {e}")
        logging.error(traceback.format_exc())
        return None
def preprocess_malaria_image(image):
    try:
        image = np.array(image.convert("RGB"))
        image = cv2.resize(image, (120, 120))
        kernel = np.array([[0, -1, 0], [-1, 6, -1], [0, -1, 0]])
        image = cv2.filter2D(image, -1, kernel)
        image_yuv = cv2.cvtColor(image, cv2.COLOR_BGR2YUV)
        image_yuv[:, :, 0] = cv2.equalizeHist(image_yuv[:, :, 0])
        image = cv2.cvtColor(image_yuv, cv2.COLOR_YUV2RGB)
        image = image.astype(np.float32) / 255.0
        return np.expand_dims(image, axis=0)
    except Exception as e:
        logging.error(f"Error in malaria image preprocessing: {e}")
        return None
def preprocess_eye_disease(image):
    try:
        image = image.convert("RGB").resize((256, 256))
        image = np.array(image, dtype=np.float32) / 255.0
        return np.expand_dims(image, axis=0)
    except Exception as e:
        logging.error(f"Error in eye disease image preprocessing: {e}")
        return None
def preprocess_brain_tumor(image):
    try:
        image = image.convert("RGB").resize((224, 224))
        image = np.array(image, dtype=np.float32) / 255.0
        return np.expand_dims(image, axis=0)
    except Exception as e:
        logging.error(f"Error in brain tumor image preprocessing: {e}")
        return None
def preprocess_heart_disease(data):
    try:
        features = data.get("features")
        if not isinstance(features, dict):
            raise ValueError("Features must be a dictionary.")
        ordered_features = [features[f] for f in feature_orders["heart_disease"]]
        features_array = np.array(ordered_features).reshape(1, -1)
        return scalers["heart_disease"].transform(features_array)
    except Exception as e:
        logging.error(f"Error in heart disease preprocessing: {e}")
        return None
def preprocess_lung_cancer(data):
    try:
        features = data.get("features")
        if not isinstance(features, dict):
            raise ValueError("Features must be a dictionary.")
        input_values = list(features.values())
        input_array = np.array(input_values).reshape(1, -1)
        logging.info(f"[Lung Cancer] Received input: {features}")
        logging.info(f"[Lung Cancer] Input array for model: {input_array}")
        return input_array
    except Exception as e:
        logging.error(f"[Lung Cancer] Preprocessing error: {e}")
        return None


def make_prediction(disease, processed_image):
    if processed_image is None:
        return jsonify({"error": "Image processing failed"}), 500
    if disease not in models or models[disease] is None:
        return jsonify({"error": f"Model for {disease} not loaded"}), 500
    try:
        prediction = models[disease].predict(processed_image)[0]
        predicted_class = class_indices[disease][np.argmax(prediction)]
        confidence = float(np.max(prediction))
        return jsonify({"disease": disease, "class": predicted_class, "confidence": confidence})
    except Exception as e:
        logging.error(f"Error during prediction for {disease}: {e}")
        return jsonify({"error": "Prediction failed"}), 500
def make_diabetes_prediction(processed_data):
    if processed_data is None:
        return jsonify({"error": "Invalid input data"}), 500
    try:
        prediction = models["diabetes"].predict(processed_data)[0]
        probability = models["diabetes"].predict_proba(processed_data)[0].tolist()
        result_label = "Diabetic" if prediction == 1 else "Non-Diabetic"
        return jsonify({
            "disease": "diabetes",
            "prediction": int(prediction),
            "label": result_label,
            "probability": [round(p, 4) for p in probability]
        })
    except Exception as e:
        logging.error(f"Diabetes prediction error: {e}")
        return jsonify({"error": "Prediction failed"}), 500
def make_heart_disease_prediction(processed_data):
    if processed_data is None:
        return jsonify({"error": "Invalid input data"}), 500
    prediction = models["heart_disease"].predict(processed_data)[0]
    probability = models["heart_disease"].predict_proba(processed_data)[0].tolist()
    return jsonify({"disease": "heart_disease", "prediction": int(prediction), "probability": probability})
def make_lung_cancer_prediction(processed_data):
    try:
        if processed_data is None:
            return jsonify({"error": "Invalid or missing input data for lung cancer"}), 400
        prediction = models["lung_cancer"].predict(processed_data)[0]
        probability = models["lung_cancer"].predict_proba(processed_data)[0].tolist()
        result_label = "Likely" if prediction == 1 else "Unlikely"
        logging.info(f"[Lung Cancer] Prediction: {prediction}, Probabilities: {probability}")
        return jsonify({
            "disease": "lung_cancer",
            "prediction": int(prediction),
            "label": result_label,
            "probability": [round(p, 4) for p in probability]
        })
    except Exception as e:
        logging.error(f"[Lung Cancer] Prediction Error: {e}")
        return jsonify({"error": "Prediction failed due to internal error"}), 500
@app.route('/predict/pneumonia', methods=['POST'])
def predict_pneumonia_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image_bytes = request.files['image'].read()
    return make_prediction("pneumonia", preprocess_image(image_bytes))
@app.route('/predict/malaria', methods=['POST'])
def predict_malaria_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image = Image.open(io.BytesIO(request.files['image'].read()))
    return make_prediction("malaria", preprocess_malaria_image(image))
@app.route('/predict/lung_cancer', methods=['POST'])
def predict_lung_cancer_api():
    try:
        data = request.get_json()
        if not data or "features" not in data:
            return jsonify({"error": "Missing features in request"}), 400
        processed = preprocess_lung_cancer(data)
        return make_lung_cancer_prediction(processed)
    except Exception as e:
        logging.error(f"[Lung Cancer API] Unexpected error: {e}")
        return jsonify({"error": "Server error during lung cancer prediction"}), 500

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes_api():
    data = request.get_json()
    return make_diabetes_prediction(preprocess_diabetes(data))
@app.route('/predict/heart_disease', methods=['POST'])
def predict_heart_disease_api():
    data = request.get_json()
    return make_heart_disease_prediction(preprocess_heart_disease(data))
@app.route('/predict/eye_disease', methods=['POST'])
def predict_eye_disease_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = Image.open(io.BytesIO(request.files['image'].read()))
    processed_image = preprocess_eye_disease(image)

    if processed_image is None:
        return jsonify({"error": "Image processing failed"}), 500

    try:
        prediction = models["eye_disease"].predict(processed_image)[0]
        predicted_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        # Hardcoded class names
        class_names = {
            0: 'Cataract',
            1: 'Diabetic Retinopathy',
            2: 'Glaucoma',
            3: 'Normal'
        }
        predicted_class = class_names.get(predicted_index, "Unknown")

        return jsonify({
            "disease": "eye_disease",
            "class": predicted_class,
            "confidence": confidence
        })
    except Exception as e:
        logging.error(f"Error during eye disease prediction: {e}")
        return jsonify({"error": "Prediction failed"}), 500

@app.route('/predict/brain_tumor', methods=['POST'])
def predict_brain_tumor_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image = Image.open(io.BytesIO(request.files['image'].read()))
    return make_prediction("brain_tumor", preprocess_brain_tumor(image))

if __name__ == '__main__':
    logging.info("Starting Flask server on port 5000...")
    app.run()