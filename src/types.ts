export interface PredictionInput {
  crop_type: string;
  implement_type: string;
  soil_resistance: number;
  speed: number;
  depth: number;
}

export interface PredictionOutput {
  fuel_consumption: number;
}

export interface OptimizationInput {
  current_depth: number;
  optimized_depth: number;
  crop_type: string;
  implement_type: string;
  soil_resistance: number;
  speed: number;
}

export interface OptimizationOutput {
  current_fuel: number;
  optimized_fuel: number;
  fuel_saved: number;
  savings_percent: number;
}

export interface ModelMetrics {
  MAE: number;
  RMSE: number;
  R2: number;
  featureImportances: { name: string; value: number }[];
  importanceData: { name: string; importance: number }[];
  actualVsPredicted: { actual: number; predicted: number; index: number }[];
}
