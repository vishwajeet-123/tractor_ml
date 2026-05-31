import os
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load machine learning model safely
MODEL_PATH = "model_data.pkl"
model_package = None

if os.path.exists(MODEL_PATH):
    try:
        model_package = joblib.load(MODEL_PATH)
        print("Scikit-learn model package loaded successfully!")
    except Exception as e:
        print(f"Error loading {MODEL_PATH}: {e}")
else:
    print(f"Warning: {MODEL_PATH} not found. Please run 'python train_model.py' first.")

def rebuild_prediction_row(crop, implement, soil_res, speed, depth):
    if not model_package:
        raise ValueError("Model is not loaded.")
    
    # Rebuild input schema with same active columns
    features = {name: 0.0 for name in model_package['feature_names']}
    
    # Fill in numerics
    features['Soil_Resistance_Index'] = float(soil_res)
    features['Tractor_Speed_kmph'] = float(speed)
    features['Tillage_Depth_cm'] = float(depth)
    
    # Fill in one-hot variables
    crop_col = f"Crop_Type_{crop}"
    if crop_col in features:
        features[crop_col] = 1.0
        
    imp_col = f"Implement_Type_{implement}"
    if imp_col in features:
        features[imp_col] = 1.0
        
    return pd.DataFrame([features])

@app.route('/predict', methods=['POST'])
@app.route('/api/predict', methods=['POST'])
def predict():
    if not model_package:
        return jsonify({'error': 'Machine learning model not trained or loaded on server.'}), 503
        
    try:
        req = request.get_json()
        crop_type = req.get('crop_type', 'Wheat')
        implement_type = req.get('implement_type', 'Disc Harrow')
        soil_resistance = float(req.get('soil_resistance', 7.0))
        speed = float(req.get('speed', 6.5))
        depth = float(req.get('depth', 22.0))
        
        # Format columns and run prediction
        row_df = rebuild_prediction_row(crop_type, implement_type, soil_resistance, speed, depth)
        prediction = model_package['model'].predict(row_df)[0]
        
        return jsonify({'fuel_consumption': round(float(prediction), 1)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/optimize', methods=['POST'])
@app.route('/api/optimize', methods=['POST'])
def optimize():
    if not model_package:
        return jsonify({'error': 'Machine learning model not loaded.'}), 503
        
    try:
        req = request.get_json()
        crop_type = req.get('crop_type', 'Wheat')
        implement_type = req.get('implement_type', 'Disc Harrow')
        soil_resistance = float(req.get('soil_resistance', 7.0))
        speed = float(req.get('speed', 6.5))
        current_depth = float(req.get('current_depth', 22.0))
        optimized_depth = float(req.get('optimized_depth', 18.0))
        
        # Calculate current & optimized predicted values
        df_curr = rebuild_prediction_row(crop_type, implement_type, soil_resistance, speed, current_depth)
        df_opt = rebuild_prediction_row(crop_type, implement_type, soil_resistance, speed, optimized_depth)
        
        f_curr = float(model_package['model'].predict(df_curr)[0])
        f_opt = float(model_package['model'].predict(df_opt)[0])
        
        saved = max(0.0, f_curr - f_opt)
        percent = (saved / f_curr) * 100 if f_curr > 0 else 0.0
        
        return jsonify({
            'current_fuel': round(f_curr, 1),
            'optimized_fuel': round(f_opt, 1),
            'fuel_saved': round(saved, 1),
            'savings_percent': round(percent, 1)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/metrics', methods=['GET'])
@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    if not model_package:
        return jsonify({'error': 'Model not loaded.'}), 503
    return jsonify(model_package['metrics'])

if __name__ == '__main__':
    # Flask port matching standard local python executions
    app.run(debug=True, host='0.0.0.0', port=5000)
