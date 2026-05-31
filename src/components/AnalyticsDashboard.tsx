import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  Cpu, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Database,
  RefreshCw,
  Gauge
} from "lucide-react";
import { ModelMetrics } from "../types";
import { trainAndEvaluateModel } from "../ml_model";

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMetrics = () => {
    setLoading(true);
    setErrorMsg(null);
    // Simulate training process in-browser
    setTimeout(() => {
      try {
        const { metrics: trainedMetrics } = trainAndEvaluateModel();
        setMetrics(trainedMetrics);
      } catch (error: any) {
        setErrorMsg(error.message || "Failed to compile predictive analytics layout.");
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-850 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Cpu className="text-[#2E7D32] dark:text-[#4CAF50] w-7 h-7" /> ML Engine Audit Trail
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Performance logs of the trained Gradient Boosting Regressor model
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="px-4 py-2 text-xs sm:text-sm bg-white dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-xl font-semibold flex items-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Recalculate Metrices
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-sm">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 text-zinc-400 dark:text-zinc-500 select-none">
          <RefreshCw className="w-12 h-12 text-[#2E7D32] dark:text-[#4CAF50] animate-spin" />
          <p className="text-sm">Retrieving high-fidelity validation scores...</p>
        </div>
      ) : metrics ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* Key Metrics Grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* R2 Score Card */}
            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 rounded-bl-full pointer-events-none"></div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-800 dark:text-emerald-400">Model Reliability</span>
                <p className="text-gray-500 dark:text-zinc-400 text-xs">R² (Variance Score)</p>
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {(metrics.R2 * 100).toFixed(2)}%
                </h4>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Indicates the share of fuel variance predicted accurately.
                </p>
              </div>
            </div>

            {/* MAE Score Card */}
            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 dark:bg-amber-950/25 rounded-bl-full pointer-events-none"></div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-800 dark:text-amber-400">Mean Deviation</span>
                <p className="text-gray-500 dark:text-zinc-400 text-xs">MAE (Absolute Error)</p>
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-amber-700 dark:text-amber-400 font-mono">
                  {metrics.MAE.toFixed(3)} <span className="text-xs font-normal">Litres</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Average gap between predicted & actual test fuel consumption.
                </p>
              </div>
            </div>

            {/* RMSE Score Card */}
            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 dark:bg-blue-950/20 rounded-bl-full pointer-events-none"></div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-800 dark:text-blue-400">Standard Deviation Deviation</span>
                <p className="text-gray-500 dark:text-zinc-400 text-xs">RMSE (Quadratic Error)</p>
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-blue-700 dark:text-blue-400 font-mono">
                  {metrics.RMSE.toFixed(3)} <span className="text-xs font-normal">Litres</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Penalizes outliers. Demonstrates general precision bounds.
                </p>
              </div>
            </div>

            {/* Big Data Rows trained */}
            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 dark:bg-purple-950/20 rounded-bl-full pointer-events-none"></div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-800 dark:text-purple-400">Observation Volume</span>
                <p className="text-gray-500 dark:text-zinc-400 text-xs">Trained Dataset Nodes</p>
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-purple-700 dark:text-purple-400 font-mono">
                  5,000 <span className="text-xs font-normal">rows</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Ensures comprehensive parameter exploration across soil types.
                </p>
              </div>
            </div>

          </div>

          {/* Graphical Analytics charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Feature Importance Bar chart */}
            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6 transitionduration-300">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-zinc-905 dark:text-white flex items-center gap-2">
                  <Activity className="text-[#2E7D32] dark:text-[#4CAF50] w-5 h-5" /> Relative Feature Importance
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  How much each agricultural metric steers the gradient boosted predictions
                </p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.importanceData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: "#9CA3AF" }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: "#9CA3AF" }} 
                      axisLine={false}
                      tickLine={false}
                      unit="%" 
                      tickFormatter={(val) => `${val * 100}`}
                    />
                    <Tooltip 
                      formatter={(val: number) => [`${(val * 100).toFixed(0)}%`, "Importance Contribution"]}
                      contentStyle={{ borderRadius: 10, background: "#1F2937", border: "none", color: "#F3F4F6", fontSize: 11 }}
                    />
                    <Bar 
                      dataKey="importance" 
                      fill="#2E7D32" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-zinc-400 text-center">
                <strong>Tillage Depth</strong> and <strong>Soil Resistance</strong> act as primary drivers due to agricultural draft force dynamics.
              </p>
            </div>

            {/* Actual vs Predicted Graph */}
            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6 transitionduration-300">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-zinc-905 dark:text-white flex items-center gap-2">
                  <TrendingUp className="text-[#2E7D32] dark:text-[#4CAF50] w-5 h-5" /> Actual vs. Predicted Validation
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Visual regression mapping across a sorted subset of test observations
                </p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metrics.actualVsPredicted}
                    margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="index" 
                      tick={{ fontSize: 9, fill: "#9CA3AF" }} 
                      label={{ value: 'Sorted Test Sample Index', position: 'insideBottom', offset: -5, fill: '#9CA3AF', fontSize: 10 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: "#9CA3AF" }} 
                      label={{ value: 'Fuel consumed (L/ha)', angle: -90, position: 'insideLeft', offset: 10, fill: '#9CA3AF', fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: 10, background: "#1F2937", border: "none", color: "#F3F4F6", fontSize: 11 }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      name="Actual Field Diesel" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      dot={false} 
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      name="GBM Machine Prediction" 
                      stroke="#2E7D32" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-zinc-400 text-center">
                Notice the snug overlap. The high-capacity Gradient Boosting ensemble manages residual variance smoothly.
              </p>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center p-12 text-zinc-400">
          No metrics compiled. Make sure the server is online.
        </div>
      )}

    </div>
  );
}
