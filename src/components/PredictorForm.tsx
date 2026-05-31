import React, { useState } from "react";
import { 
  CheckCircle, 
  HelpCircle, 
  Settings, 
  Activity, 
  Award, 
  Download, 
  Cpu, 
  TrendingDown, 
  ChevronRight, 
  Truck, 
  Sprout, 
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { jsPDF } from "jspdf";
import { PredictionInput, OptimizationOutput } from "../types";

export default function PredictorForm() {
  const [formData, setFormData] = useState<PredictionInput>({
    crop_type: "Wheat",
    implement_type: "Disc Harrow",
    soil_resistance: 7,
    speed: 6.5,
    depth: 22,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);

  // Optimization state variables
  const [optDepth, setOptDepth] = useState<number>(18);
  const [optLoading, setOptLoading] = useState<boolean>(false);
  const [optimization, setOptimization] = useState<OptimizationOutput | null>(null);

  const crops = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"];
  const implementList = ["Moldboard Plow", "Disc Harrow", "Chisel Plow", "Cultivator"];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setPrediction(null);
    setOptimization(null); // Reset optimization values on new base prediction

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Prediction request fell short.");
      }

      const result = await response.json();
      setPrediction(result.fuel_consumption);
      
      // Auto-set starting optimized depth candidate to slightly less than current depth
      const startingOpt = Math.max(8, Math.round(formData.depth * 0.8));
      setOptDepth(startingOpt);
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to reach prediction model server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (prediction === null) return;
    setOptLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop_type: formData.crop_type,
          implement_type: formData.implement_type,
          soil_resistance: formData.soil_resistance,
          speed: formData.speed,
          current_depth: formData.depth,
          optimized_depth: optDepth,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Optimization request failed.");
      }

      const result = await response.json();
      setOptimization(result);
    } catch (err: any) {
      setErrorMsg(err.message || "Optimization error.");
    } finally {
      setOptLoading(false);
    }
  };

  const downloadPDFReport = () => {
    if (prediction === null) return;

    const doc = new jsPDF();

    // Color Palette
    const primaryColor = "#2E7D32";
    const darkGray = "#212121";
    const lightGray = "#F5F5F5";

    // Header Background Accent Bar
    doc.setFillColor(46, 125, 50); // hex #2E7D32
    doc.rect(0, 0, 210, 40, "F");

    // Title text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AgriFuel AI System Engine", 15, 20);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Precision Field Predictor Metric Audit Report", 15, 28);
    doc.text("Date Generated: " + new Date().toLocaleDateString("en-US"), 135, 28);

    // Document Sections
    doc.setTextColor(darkGray);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("1. Input Configuration Diagnostics", 15, 55);

    // Draw horizontal separator
    doc.setDrawColor(210, 210, 210);
    doc.line(15, 58, 195, 58);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // Grid alignment parameters
    const startY = 66;
    doc.text(`Crop Canopy Cover:  ${formData.crop_type}`, 20, startY);
    doc.text(`Active Field Implement:  ${formData.implement_type}`, 20, startY + 8);
    doc.text(`Soil Resistance Coefficient:  ${formData.soil_resistance} (Scale 4-10)`, 20, startY + 16);
    doc.text(`Target Tractor Speed:  ${formData.speed} kmph`, 20, startY + 24);
    doc.text(`Operational Tillage Depth:  ${formData.depth} cm`, 20, startY + 32);

    // Section 2 - Predictions
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("2. Model Predictions Outcome", 15,startY + 50);
    doc.line(15, startY + 53, 195, startY + 53);

    doc.setFillColor(245, 255, 245);
    doc.rect(15, startY + 58, 180, 25, "F");
    doc.setDrawColor(46, 125, 50);
    doc.rect(15, startY + 58, 180, 25, "S");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 125, 50);
    doc.setFontSize(12);
    doc.text("PREDICTED TRACTOR FUEL CONSUMPTION :", 22, startY + 70);
    doc.setFontSize(16);
    doc.text(`${prediction.toFixed(1)} L/ha`, 140, startY + 70);

    // Section 3 - Optimization (if present)
    if (optimization) {
      doc.setTextColor(darkGray);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("3. Energy Optimization Diagnostic Summaries", 15, startY + 100);
      doc.setDrawColor(210, 210, 210);
      doc.line(15, startY + 103, 195, startY + 103);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Modified Target Optimized Depth:  ${optDepth} cm (Reduced from ${formData.depth} cm)`, 20, startY + 112);
      doc.text(`Current Baseline Fuel Expected:  ${optimization.current_fuel.toFixed(1)} Litres/Hectare`, 20, startY + 120);
      doc.text(`Optimized Depth Fuel Expected:  ${optimization.optimized_fuel.toFixed(1)} Litres/Hectare`, 20, startY + 128);

      // Savings Highlight
      doc.setFillColor(232, 245, 233);
      doc.rect(15, startY + 135, 180, 20, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(46, 125, 50);
      doc.setFontSize(11);
      doc.text(`FUEL SAVED: ${optimization.fuel_saved.toFixed(1)} Litres/Hectare (${optimization.savings_percent.toFixed(1)}% savings)`, 22, startY + 147);
    }

    // Disclaimer footer
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const textNote = "Note: Fuel calculations are produced dynamically via gradient boosting algorithms trained in high-fidelity agricultural parameters. Real fuel requirements may pivot slightly based on tire wear, weather humidity, and vehicle manufacturer design thresholds.";
    doc.text(textNote, 15, 275, { maxWidth: 180 });

    // Save document
    doc.save(`agrifuel-predictor-report-${formData.crop_type.toLowerCase()}-${formData.depth}cm.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ML Configuration Panel */}
        <form 
          onSubmit={handlePredict} 
          className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#2E7D32] dark:text-[#4CAF50]">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">Diagnostic Variables</h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Configure parameters for physical regression estimation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Crop Type Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-805 dark:text-zinc-200 block">
                Crop Canopy Cover Type
              </label>
              <select
                value={formData.crop_type}
                onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-805 dark:text-zinc-100 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/50 transition-all font-sans text-sm"
              >
                {crops.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p className="text-[10px] text-zinc-400">Canopy drag and soil compact modifiers apply</p>
            </div>

            {/* Implement Type Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-805 dark:text-zinc-200 block">
                Field Implement Unit Class
              </label>
              <select
                value={formData.implement_type}
                onChange={(e) => setFormData({ ...formData, implement_type: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-805 dark:text-zinc-100 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/50 transition-all font-sans text-sm"
              >
                {implementList.map((imp) => (
                  <option key={imp} value={imp}>{imp}</option>
                ))}
              </select>
              <p className="text-[10px] text-zinc-400">Heavier implements generate increased physical resistance</p>
            </div>

            {/* Soil Resistance Coefficient */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-zinc-805 dark:text-zinc-200">
                  Soil Resistance Index (SRI)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="4"
                    max="10"
                    step="0.1"
                    value={formData.soil_resistance}
                    onChange={(e) => setFormData({ ...formData, soil_resistance: Math.min(10, Math.max(4, Number(e.target.value))) })}
                    className="w-16 text-center py-0.5 rounded border border-zinc-250 dark:border-zinc-750 bg-zinc-100 dark:bg-zinc-800 font-mono text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold"
                  />
                  <span className="text-xs text-zinc-400">(Limit: 4 – 10)</span>
                </div>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.1"
                value={formData.soil_resistance}
                onChange={(e) => setFormData({ ...formData, soil_resistance: Number(e.target.value) })}
                className="w-full h-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 appearance-none cursor-pointer accent-[#2E7D32] dark:accent-[#4CAF50]"
              />
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Medium Sandy Sand (4.0)</span>
                <span>Average Silt-Loam (7.0)</span>
                <span>Heavy Compact Clay (10.0)</span>
              </div>
            </div>

            {/* Tractor Speed Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-zinc-805 dark:text-zinc-200">
                  Tractor Core Speed
                </label>
                <span className="font-mono text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                  {formData.speed.toFixed(1)} km/h
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="9"
                step="0.1"
                value={formData.speed}
                onChange={(e) => setFormData({ ...formData, speed: Number(e.target.value) })}
                className="w-full h-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 appearance-none cursor-pointer accent-[#2E7D32] dark:accent-[#4CAF50]"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Slow Crawl (4 km/h)</span>
                <span>Recommended Tillage (6.5)</span>
                <span>Fast Pull (9 km/h)</span>
              </div>
            </div>

            {/* Tillage Depth Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-zinc-805 dark:text-zinc-200">
                  Tillage Depth
                </label>
                <span className="font-mono text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                  {formData.depth} cm
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="35"
                step="1"
                value={formData.depth}
                onChange={(e) => setFormData({ ...formData, depth: Number(e.target.value) })}
                className="w-full h-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 appearance-none cursor-pointer accent-[#2E7D32] dark:accent-[#4CAF50]"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Shallow Mix (8 cm)</span>
                <span>Medium Disc (22 cm)</span>
                <span>Deep Subsoil (35 cm)</span>
              </div>
            </div>

          </div>

          {/* Validation Notice and Predict trigger Button */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-2.5 border border-rose-200 dark:border-rose-900/40">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#1E5622] dark:bg-[#4CAF50] dark:hover:bg-[#3D8C40] text-white rounded-2xl font-bold text-base shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/50 flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Fuel Telemetry...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Analyze & Predict Fuel Consumption
              </>
            )}
          </button>
        </form>

        {/* Predict & Optimization Outcomes Dashboard */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Main Predict Outcome Card */}
          {prediction !== null ? (
            <div className="bg-[#2E7D32] text-white p-6 sm:p-8 rounded-[24px] shadow-lg relative overflow-hidden flex flex-col justify-between aspect-video select-none transform hover:scale-101 transition-all duration-300">
              {/* Background Accents decoration */}
              <div className="absolute top-0 right-0 w-48 h-40 bg-white/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-semibold">
                    <Award className="w-3.5 h-3.5" /> High-Accuracy AI Score
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-100 pt-2 font-mono">ESTIMATED FUEL DEMAND</p>
                </div>
                <div className="p-2 bg-white/10 rounded-xl">
                   <Truck className="w-5 h-5 text-emerald-200" />
                </div>
              </div>

              <div>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tight flex items-baseline gap-1">
                  {prediction.toFixed(1)}
                  <span className="text-lg sm:text-xl font-normal text-emerald-200">Litres/Hectare</span>
                </h3>
                <p className="text-xs text-emerald-200 mt-2">
                  Estimated for {formData.crop_type} cover using {formData.implement_type} tool.
                </p>
              </div>

              <div className="flex gap-4 border-t border-white/15 pt-4 mt-6">
                <button
                  onClick={downloadPDFReport}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 select-text"
                >
                  <Download className="w-4 h-4" /> Download Prediction Report (PDF)
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[24px] p-8 text-center text-zinc-400 dark:text-zinc-500 h-64 flex flex-col justify-center items-center gap-4 transition-colors duration-300">
               <Cpu className="w-12 h-12 text-zinc-350 dark:text-zinc-700 animate-pulse" />
               <div className="space-y-1">
                 <p className="font-semibold text-zinc-700 dark:text-zinc-300">Awaiting Variable Configuration</p>
                 <p className="text-xs max-w-xs mx-auto">Fill in soil and tractor configurations on the left side, then run calculations to reveal predictions.</p>
               </div>
            </div>
          )}

          {/* Connected Tillage Depth Optimization Section */}
          {prediction !== null && (
            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 sm:p-8 rounded-[24px] shadow-sm space-y-6 transition-colors duration-300">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-[#4CAF50] text-[10px] font-mono uppercase tracking-wider font-bold">
                  Energy Safeguard Utility
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Acre-Wide Depth Optimization</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Adjust tillage parameters to compute potential fuel and emission offsets.
                </p>
              </div>

              <div className="space-y-5">
                {/* Proposed Target Depth input slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-300 font-semibold">
                      Proposed Optimized Depth
                    </span>
                    <span className="font-mono text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                      {optDepth} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="35"
                    step="1"
                    value={optDepth}
                    onChange={(e) => setOptDepth(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 appearance-none cursor-pointer accent-[#2E7D32] dark:accent-[#4CAF50]"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-400">
                    <span>Shallowest (8 cm)</span>
                    <span>Current Baseline ({formData.depth} cm)</span>
                    <span>Deepest (35 cm)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOptimize}
                  disabled={optLoading}
                  className="w-full py-2.5 border-2 border-[#2E7D32] dark:border-[#4CAF50] text-[#2E7D32] dark:text-[#4CAF50] hover:bg-[#2E7D32]/5 dark:hover:bg-[#4CAF50]/5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {optLoading ? "Calculating Fuel Saved..." : "Run Optimization Recalculations"}
                </button>

                {/* Optimization outcomes metrics boxes */}
                {optimization && (
                  <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    
                    {/* Fuel comparison display grids */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl border border-zinc-100 dark:border-zinc-750 text-center">
                        <span className="text-[10px] text-zinc-400 block tracking-wide">BASELINE FUEL</span>
                        <span className="text-base font-semibold text-zinc-600 dark:text-zinc-300 font-mono">
                          {optimization.current_fuel.toFixed(1)} L/ha
                        </span>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20 text-center">
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block tracking-wide">OPTIMIZED FUEL</span>
                        <span className="text-base font-bold text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                          {optimization.optimized_fuel.toFixed(1)} L/ha
                        </span>
                      </div>
                    </div>

                    {/* Offset Savings results badge summary */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl flex items-center gap-3.5 border border-emerald-200/50 dark:border-emerald-900/30">
                      <div className="p-2.5 rounded-lg bg-[#2E7D32] text-white">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">Diesel Conserved & Efficiencies</p>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-lg font-extrabold text-[#2E7D32] dark:text-[#4CAF50] font-mono">
                            {optimization.fuel_saved.toFixed(1)} L/ha Saved
                          </span>
                          <span className="text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold font-mono">
                            (-{optimization.savings_percent.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-400 italic text-center">
                      Reducing tillage depth minimizes draft pull and wear on tractor engines.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
