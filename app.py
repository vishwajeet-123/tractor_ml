import streamlit as st
import joblib
import pandas as pd

# Load model
model = joblib.load("model.pkl")

st.title("🚜 Tractor Fuel Consumption Predictor")

crop = st.selectbox(
    "Crop Type",
    ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"]
)

implement = st.selectbox(
    "Implement Type",
    ["Moldboard Plow", "Disc Harrow", "Chisel Plow", "Cultivator"]
)

soil = st.number_input(
    "Soil Resistance Index",
    min_value=4.0,
    max_value=10.0,
    value=7.0
)

speed = st.number_input(
    "Tractor Speed (km/h)",
    min_value=4.0,
    max_value=9.0,
    value=6.0
)

depth = st.number_input(
    "Tillage Depth (cm)",
    min_value=8,
    max_value=35,
    value=20
)

if st.button("Predict Fuel Consumption"):

    input_data = pd.DataFrame({
        "Crop_Type":[crop],
        "Implement_Type":[implement],
        "Soil_Resistance_Index":[soil],
        "Tractor_Speed_kmph":[speed],
        "Tillage_Depth_cm":[depth]
    })

    prediction = model.predict(input_data)

    st.success(
        f"Predicted Fuel Consumption: {prediction[0]:.2f} L/ha"
    )