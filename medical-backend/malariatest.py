import requests

# 🔗 Replace with your actual Flask endpoint
API_URL = "http://127.0.0.1:5000/predict/lung_cancer"

# 🧪 Sample test data (from your provided dataset)
test_data = [
    {"GENDER": "M", "AGE": 69, "SMOKING": 1, "YELLOW_FINGERS": 2, "ANXIETY": 2, "PEER_PRESSURE": 1, "CHRONIC DISEASE": 1, "FATIGUE": 2, "ALLERGY": 1, "WHEEZING": 2, "ALCOHOL CONSUMING": 2, "COUGHING": 2, "SHORTNESS OF BREATH": 2, "SWALLOWING DIFFICULTY": 2, "CHEST PAIN": 2},
    {"GENDER": "M", "AGE": 74, "SMOKING": 2, "YELLOW_FINGERS": 1, "ANXIETY": 1, "PEER_PRESSURE": 1, "CHRONIC DISEASE": 2, "FATIGUE": 2, "ALLERGY": 2, "WHEEZING": 1, "ALCOHOL CONSUMING": 1, "COUGHING": 1, "SHORTNESS OF BREATH": 2, "SWALLOWING DIFFICULTY": 2, "CHEST PAIN": 2},
    {"GENDER": "F", "AGE": 59, "SMOKING": 1, "YELLOW_FINGERS": 1, "ANXIETY": 1, "PEER_PRESSURE": 2, "CHRONIC DISEASE": 1, "FATIGUE": 2, "ALLERGY": 1, "WHEEZING": 2, "ALCOHOL CONSUMING": 1, "COUGHING": 2, "SHORTNESS OF BREATH": 2, "SWALLOWING DIFFICULTY": 1, "CHEST PAIN": 2},
    {"GENDER": "M", "AGE": 63, "SMOKING": 2, "YELLOW_FINGERS": 2, "ANXIETY": 2, "PEER_PRESSURE": 1, "CHRONIC DISEASE": 1, "FATIGUE": 1, "ALLERGY": 1, "WHEEZING": 2, "ALCOHOL CONSUMING": 1, "COUGHING": 1, "SHORTNESS OF BREATH": 2, "SWALLOWING DIFFICULTY": 2, "CHEST PAIN": 2},
    {"GENDER": "F", "AGE": 63, "SMOKING": 1, "YELLOW_FINGERS": 2, "ANXIETY": 1, "PEER_PRESSURE": 1, "CHRONIC DISEASE": 1, "FATIGUE": 1, "ALLERGY": 2, "WHEEZING": 1, "ALCOHOL CONSUMING": 2, "COUGHING": 2, "SHORTNESS OF BREATH": 1, "SWALLOWING DIFFICULTY": 1, "CHEST PAIN": 1}
]

# 🔁 Convert categorical "GENDER" to numeric if your model expects it
gender_map = {"M": 1, "F": 0}

# 🔄 Send requests and print responses
for i, record in enumerate(test_data):
    # Convert gender
    record["GENDER"] = gender_map.get(record["GENDER"], 0)

    payload = {
        "features": record
    }

    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            result = response.json()
            print(f"🧪 Test Case {i + 1}:")
            print(f"  ➤ Prediction: {result['label']}")
            print(f"  ➤ Confidence: {result['probability']}")
            print("-" * 50)
        else:
            print(f"❌ Test Case {i + 1}: Failed with status {response.status_code}")
    except Exception as e:
        print(f"⚠️ Test Case {i + 1} Exception: {e}")
