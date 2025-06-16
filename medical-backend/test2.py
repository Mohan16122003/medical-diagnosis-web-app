import requests

url = "http://127.0.0.1:5000/predict/heart_disease"

test_cases = [
    {"age": 52, "sex": 1, "cp": 0, "trestbps": 125, "chol": 212, "fbs": 0, "restecg": 1, "thalach": 168, "exang": 0, "oldpeak": 1, "slope": 2, "ca": 2, "thal": 3},
    {"age": 53, "sex": 1, "cp": 0, "trestbps": 140, "chol": 203, "fbs": 1, "restecg": 0, "thalach": 155, "exang": 1, "oldpeak": 3.1, "slope": 0, "ca": 0, "thal": 3},
    {"age": 70, "sex": 1, "cp": 0, "trestbps": 145, "chol": 174, "fbs": 0, "restecg": 1, "thalach": 125, "exang": 1, "oldpeak": 2.6, "slope": 0, "ca": 0, "thal": 3},
    {"age": 61, "sex": 1, "cp": 0, "trestbps": 148, "chol": 203, "fbs": 0, "restecg": 1, "thalach": 161, "exang": 0, "oldpeak": 0, "slope": 2, "ca": 1, "thal": 3},
    {"age": 62, "sex": 0, "cp": 0, "trestbps": 138, "chol": 294, "fbs": 1, "restecg": 1, "thalach": 106, "exang": 0, "oldpeak": 1.9, "slope": 1, "ca": 3, "thal": 2},
    {"age": 58, "sex": 0, "cp": 0, "trestbps": 100, "chol": 248, "fbs": 0, "restecg": 0, "thalach": 122, "exang": 0, "oldpeak": 1, "slope": 1, "ca": 0, "thal": 2},
    {"age": 58, "sex": 1, "cp": 0, "trestbps": 114, "chol": 318, "fbs": 0, "restecg": 2, "thalach": 140, "exang": 0, "oldpeak": 4.4, "slope": 0, "ca": 3, "thal": 1},
    {"age": 55, "sex": 1, "cp": 0, "trestbps": 160, "chol": 289, "fbs": 0, "restecg": 0, "thalach": 145, "exang": 1, "oldpeak": 0.8, "slope": 1, "ca": 1, "thal": 3},
    {"age": 46, "sex": 1, "cp": 0, "trestbps": 120, "chol": 249, "fbs": 0, "restecg": 0, "thalach": 144, "exang": 0, "oldpeak": 0.8, "slope": 2, "ca": 0, "thal": 3},
    {"age": 54, "sex": 1, "cp": 0, "trestbps": 122, "chol": 286, "fbs": 0, "restecg": 0, "thalach": 116, "exang": 1, "oldpeak": 3.2, "slope": 1, "ca": 2, "thal": 2},
    {"age": 71, "sex": 0, "cp": 0, "trestbps": 112, "chol": 149, "fbs": 0, "restecg": 1, "thalach": 125, "exang": 0, "oldpeak": 1.6, "slope": 1, "ca": 0, "thal": 2},
    {"age": 43, "sex": 0, "cp": 0, "trestbps": 132, "chol": 341, "fbs": 1, "restecg": 0, "thalach": 136, "exang": 1, "oldpeak": 3, "slope": 1, "ca": 0, "thal": 3},
    {"age": 34, "sex": 0, "cp": 1, "trestbps": 118, "chol": 210, "fbs": 0, "restecg": 1, "thalach": 192, "exang": 0, "oldpeak": 0.7, "slope": 2, "ca": 0, "thal": 2},
    {"age": 51, "sex": 1, "cp": 0, "trestbps": 140, "chol": 298, "fbs": 0, "restecg": 1, "thalach": 122, "exang": 1, "oldpeak": 4.2, "slope": 1, "ca": 3, "thal": 3}
]

# Loop through test cases
for i, features in enumerate(test_cases, 1):
    response = requests.post(url, json={"features": features})
    print(f"🔹 Test Case {i}: {features}")
    print(f"➡️  Status Code: {response.status_code}")
    print(f"➡️  Response: {response.json()}")
    print("-" * 50)