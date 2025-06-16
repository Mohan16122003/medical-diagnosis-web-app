import requests

# Update the URL to point to the brain tumor prediction endpoint
url = "http://127.0.0.1:5000/predict/malaria"

# Replace with the correct path to a brain MRI scan image
image_path = r"C:\Users\siras\Downloads\C100P61ThinF_IMG_20150918_144104_cell_169.png"

try:
    with open(image_path, "rb") as img_file:
        files = {"image": img_file}
        response = requests.post(url, files=files)  # Use POST to send the image

    if response.status_code == 200:
        print("Brain Tumor Prediction Response:", response.json())
    else:
        print(f"Server responded with status code: {response.status_code}", response.text)

except requests.ConnectionError:
    print("Server is not running or unreachable.")
except FileNotFoundError:
    print(f"Image file '{image_path}' not found.")
