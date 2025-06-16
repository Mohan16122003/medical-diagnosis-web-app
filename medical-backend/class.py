import pickle

# Path to your .pkl file
pkl_file_path = r'C:\Users\siras\OneDrive\Documents\Study\WOW\Website\backend\models\pneumonia_class_indices (3).pkl'  # or 'stroke_features.pkl', etc.

# Load the pickle file
with open(pkl_file_path, 'rb') as f:
    data = pickle.load(f)

# Print the contents
print("Contents of the .pkl file:")
print(data)