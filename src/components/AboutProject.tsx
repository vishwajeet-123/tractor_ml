import { Sprout, BarChart3, ShieldCheck, HeartPulse, HardDrive, Cpu, Gauge, Leaf } from "lucide-react";

export default function AboutProject() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* Overview Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 sm:p-10 rounded-[32px] shadow-sm select-none transition-all duration-300">
        <div className="lg:col-span-7 space-y-5">
          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-[#4CAF50] text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100/30">
            <Leaf className="w-3.5 h-3.5" /> High-Utility Agriculture Telemetry
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-905 dark:text-white tracking-tight">
            Predicting & Optimizing Agricultural Draft Forces
          </h2>
          <p className="text-sm sm:text-base text-zinc-650 dark:text-zinc-300 leading-relaxed">
            The **Tractor Fuel Consumption Predictor** is a modern decision-support tool designed to bring scientific clarity to mechanized field operations. High diesel requirements represent one of the most substantial operating overheads for farmers, alongside driving carbon emissions in agricultural ecosystems. 
          </p>
          <p className="text-sm sm:text-base text-zinc-650 dark:text-zinc-300 leading-relaxed">
            By analyzing physical relationships between tractor speed, soil compactness (resistances), active and target crops, tillage depths, and implements directly, our custom machine learning engine empowers growers to pinpoint exactly where diesel is being lost, saving fuel and improving general agricultural margins.
          </p>
        </div>
        <div className="lg:col-span-1"></div>
        <div className="lg:col-span-4 bg-emerald-50/50 dark:bg-zinc-855 rounded-2xl p-6 border border-emerald-100 dark:border-zinc-800 text-center space-y-4">
           <div className="p-3 bg-[#2E7D32] dark:bg-[#4CAF50] text-white w-12 h-12 rounded-xl mx-auto flex items-center justify-center shadow-md">
             <Sprout className="w-6 h-6" />
           </div>
           <h4 className="font-bold text-zinc-900 dark:text-white">Precision Farming</h4>
           <p className="text-xs text-zinc-500 dark:text-zinc-400">
             Ensuring mechanical practices align cleanly with target crop canopies, soil resistance coefficients, and energy efficiency bounds.
           </p>
        </div>
      </div>

      {/* Problem, Objective & Workflow Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Problem block */}
        <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 sm:p-8 rounded-[24px] shadow-sm space-y-4 transition-colors duration-300">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 w-11 h-11 rounded-xl flex items-center justify-center">
             <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Problem Statement</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Mechanized operations rely on standardized tillage setting, regardless of real-time soil compactness variations. Unoptimized deep tillage triggers massive tractor drag, leading to severe tire slip, fuel spikes, and soil structural erosion.
          </p>
        </div>

        {/* Objective block */}
        <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 sm:p-8 rounded-[24px] shadow-sm space-y-4 transition-colors duration-300">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-[#2E7D32] dark:text-[#4CAF50] w-11 h-11 rounded-xl flex items-center justify-center">
             <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Project Objectives</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            The core objective is to deliver data-backed operations. This system dynamically evaluates drag configurations, allowing operators to run "what-if" tillage modifications that maintain seed germination while conserving energy.
          </p>
        </div>

        {/* Workflow block */}
        <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 p-6 sm:p-8 rounded-[24px] shadow-sm space-y-4 transition-colors duration-300">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 w-11 h-11 rounded-xl flex items-center justify-center">
             <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">ML Workflow</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Trains an ensemble of 50 Regression Trees in real-time. Features undergo randomized splitting criteria based on MSE, forming a high-capacity Gradient Boosting Regressor with cross-validated test reliability outputs.
          </p>
        </div>

      </div>

      {/* Sustainable Benefits Sections */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">Sustainable Farming Direct Offsets</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Tactical advantages of precision operations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="bg-zinc-50 dark:bg-zinc-850 p-6 rounded-2xl space-y-3 border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase">Mechanical Bounds</span>
            <h4 className="font-bold text-zinc-905 dark:text-white text-base">Reduce Fuel Cost</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              By calibrating tillage depth to actual soil resistance coefficients, farmers can shave up to 25% off diesel costs.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-850 p-6 rounded-2xl space-y-3 border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase">Asset Safeguards</span>
            <h4 className="font-bold text-zinc-905 dark:text-white text-base">Improve Efficiency</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Minimizing mechanical over-drag limits gear heat, tires wear, and long-term transmission decay in heavy-duty tractors.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-850 p-6 rounded-2xl space-y-3 border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase">Ecological Bounds</span>
            <h4 className="font-bold text-zinc-905 dark:text-white text-base">Sustainable Farming</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Decreasing engine fuel consumption keeps emissions low and prevents aggressive subsoil compaction, protecting helpful soil microbiota.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
