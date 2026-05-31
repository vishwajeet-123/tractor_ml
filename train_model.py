import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

def generate_and_train():
    print("Generating 5000 rows of synthetic agricultural telemetry...")
    np.random.seed(42)
    n_samples = 5000

    crops = np.random.choice(['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane'], n_samples)
    implements = np.random.choice(['Moldboard Plow', 'Disc Harrow', 'Chisel Plow', 'Cultivator'], n_samples)
    soil_resistance = np.random.uniform(4, 10, n_samples)
    tractor_speed = np.random.uniform(4, 9, n_samples)
    tillage_depth = np.random.uniform(8, 35, n_samples)

    # Dictionary for physics modifiers
    crop_modifiers = {
        'Wheat': 0.2, 'Maize': 0.5, 'Cotton': 0.8, 'Rice': 1.2, 'Sugarcane': 1.8
    }
    implement_modifiers = {
        'Moldboard Plow': 3.5, 'Chisel Plow': 2.0, 'Disc Harrow': 0.0, 'Cultivator': -1.5
    }

    # Base formula mapping with randomized normal noise
    noise = np.random.normal(0, 0.4, n_samples)
    
    fuel_consumption = []
    for i in range(n_samples):
        cr_mod = crop_modifiers[crops[i]]
        imp_mod = implement_modifiers[implements[i]]
        
        # Base formula: 0.45 * Depth + 1.2 * SoilResistance - 0.3 * Speed + modifiers + noise
        val = (tillage_depth[i] * 0.45) + (soil_resistance[i] * 1.2) - (tractor_speed[i] * 0.3) + cr_mod + imp_mod + noise[i]
        val = max(3.0, val) # Clamp baseline
        fuel_consumption.append(val)

    df = pd.DataFrame({
        'Crop_Type': crops,
        'Implement_Type': implements,
        'Soil_Resistance_Index': soil_resistance,
        'Tractor_Speed_kmph': tractor_speed,
        'Tillage_Depth_cm': tillage_depth,
        'Fuel_Consumption_L_ha': fuel_consumption
    })

    # Prepare features (one-hot encode categoricals for scikit-learn models)
    df_encoded = pd.get_dummies(df, columns=['Crop_Type', 'Implement_Type'])
    
    X = df_encoded.drop('Fuel_Consumption_L_ha', axis=1)
    y = df_encoded['Fuel_Consumption_L_ha']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize GradientBoostingRegressor
    print("Training GradientBoostingRegressor model...")
    model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    model.fit(X_train, y_train)

    # Predictions and validation
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)

    print(f"Training completed successfully!")
    print(f"MAE: {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R2 Score: {r2*100:.2f}%")

    # Save model and columns schema
    save_package = {
        'model': model,
        'feature_names': list(X.columns),
        'crop_modifiers': crop_modifiers,
        'implement_modifiers': implement_modifiers,
        'metrics': {
            'MAE': mae,
            'RMSE': rmse,
            'R2': r2
        }
    }
    
    joblib.dump(save_package, 'model_data.pkl')
    print("Model serialized to 'model_data.pkl'")

if __name__ == "__main__":
    generate_and_train()
