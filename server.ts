import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { trainAndEvaluateModel, CROPS, IMPLEMENTS } from "./src/ml_model";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware to parse POST payloads
  app.use(express.json());

  console.log("----------------------------------------");
  console.log("TRAINING GRADIENT BOOSTING REGRESSOR...");
  const { model, metrics } = trainAndEvaluateModel();
  console.log("MODEL TRAINED SUCCESSFULLY!");
  console.log(`R² Score: ${(metrics.R2 * 100).toFixed(2)}%`);
  console.log(`Mean Absolute Error (MAE): ${metrics.MAE.toFixed(4)}`);
  console.log(`Root Mean Squared Error (RMSE): ${metrics.RMSE.toFixed(4)}`);
  console.log("----------------------------------------");

  // Helper validation function
  const validateInputs = (
    crop_type: string,
    implement_type: string,
    soil_resistance: any,
    speed: any,
    depth: any
  ): string | null => {
    if (!crop_type || !CROPS.includes(crop_type)) {
      return `Invalid or missing 'crop_type'. Allowed: ${CROPS.join(", ")}`;
    }
    if (!implement_type || !IMPLEMENTS.includes(implement_type)) {
      return `Invalid or missing 'implement_type'. Allowed: ${IMPLEMENTS.join(", ")}`;
    }
    const sr = Number(soil_resistance);
    if (isNaN(sr) || sr < 4 || sr > 10) {
      return "Soil resistance index must be a numeric value between 4 and 10.";
    }
    const sp = Number(speed);
    if (isNaN(sp) || sp < 4 || sp > 9) {
      return "Tractor speed must be a numeric value between 4 and 9 km/h.";
    }
    const dp = Number(depth);
    if (isNaN(dp) || dp < 8 || dp > 35) {
      return "Tillage depth must be a numeric value between 8 and 35 cm.";
    }
    return null;
  };

  // Prediction endpoint: Supports both root and /api prefixes
  const predictHandler = (req: Request, res: Response) => {
    const { crop_type, implement_type, soil_resistance, speed, depth } = req.body;
    
    const errorMsg = validateInputs(crop_type, implement_type, soil_resistance, speed, depth);
    if (errorMsg) {
      res.status(400).json({ error: errorMsg });
      return;
    }

    const cropIdx = CROPS.indexOf(crop_type);
    const implementIdx = IMPLEMENTS.indexOf(implement_type);

    const sample = {
      cropType: crop_type,
      implementType: implement_type,
      soilResistance: Number(soil_resistance),
      speed: Number(speed),
      depth: Number(depth),
      features: [cropIdx, implementIdx, Number(soil_resistance), Number(speed), Number(depth)],
      target: 0
    };

    const prediction = model.predictSingle(sample);
    // Return formatted result
    res.json({ fuel_consumption: Math.round(prediction * 10) / 10 });
  };

  app.post("/predict", predictHandler);
  app.post("/api/predict", predictHandler);

  // Optimization endpoint: Supports both root and /api prefixes
  const optimizeHandler = (req: Request, res: Response) => {
    const { current_depth, optimized_depth, crop_type, implement_type, soil_resistance, speed } = req.body;

    const errorMsgCurrent = validateInputs(crop_type, implement_type, soil_resistance, speed, current_depth);
    if (errorMsgCurrent) {
       res.status(400).json({ error: `Current state: ${errorMsgCurrent}` });
       return;
    }

    const optDp = Number(optimized_depth);
    if (isNaN(optDp) || optDp < 8 || optDp > 35) {
       res.status(400).json({ error: "Optimized tillage depth must be a numeric value between 8 and 35 cm." });
       return;
    }

    const cropIdx = CROPS.indexOf(crop_type);
    const implementIdx = IMPLEMENTS.indexOf(implement_type);

    // Current State Sample
    const sampleCurrent = {
      cropType: crop_type,
      implementType: implement_type,
      soilResistance: Number(soil_resistance),
      speed: Number(speed),
      depth: Number(current_depth),
      features: [cropIdx, implementIdx, Number(soil_resistance), Number(speed), Number(current_depth)],
      target: 0
    };

    // Optimized State Sample
    const sampleOptimized = {
      cropType: crop_type,
      implementType: implement_type,
      soilResistance: Number(soil_resistance),
      speed: Number(speed),
      depth: optDp,
      features: [cropIdx, implementIdx, Number(soil_resistance), Number(speed), optDp],
      target: 0
    };

    const current_fuel = model.predictSingle(sampleCurrent);
    const optimized_fuel = model.predictSingle(sampleOptimized);
    const fuel_saved = Math.max(0, current_fuel - optimized_fuel);
    const savings_percent = (fuel_saved / current_fuel) * 100;

    res.json({
      current_fuel: Math.round(current_fuel * 10) / 10,
      optimized_fuel: Math.round(optimized_fuel * 10) / 10,
      fuel_saved: Math.round(fuel_saved * 10) / 10,
      savings_percent: Math.round(savings_percent * 10) / 10
    });
  };

  app.post("/optimize", optimizeHandler);
  app.post("/api/optimize", optimizeHandler);

  // Metrics endpoint
  const metricsHandler = (req: Request, res: Response) => {
    res.json(metrics);
  };

  app.get("/metrics", metricsHandler);
  app.get("/api/metrics", metricsHandler);

  // Health endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Vite development integration or static files production hosting
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite Development Middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Static asset hosting configured at ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start full-stack server:", error);
});
