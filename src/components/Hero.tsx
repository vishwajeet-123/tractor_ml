import { ChevronRight, Gauge, HelpCircle, ShieldCheck, Cpu, Droplet, Sprout } from "lucide-react";

interface HeroProps {
  onPredictClick: () => void;
  onAboutClick: () => void;
}

export default function Hero({ onPredictClick, onAboutClick }: HeroProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Editorial Tech Typography Box */}
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/30 text-xs font-semibold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5" /> Next-Gen Machine Learning
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white leading-[1.1] tracking-tight">
          AI-Based Tractor <br />
          <span className="text-[#2E7D32] dark:text-[#4CAF50] bg-clip-text">
            Fuel Consumption
          </span> <br />
          Prediction System
        </h1>

        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
          Optimize tillage depths, minimize diesel waste, and build sustainable farming workflows with real-time gradient boosted ensemble intelligence.
        </p>

        {/* Action Button Set */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            onClick={onPredictClick}
            className="px-6 py-3 bg-[#2E7D32] hover:bg-[#235F26] dark:bg-[#4CAF50] dark:hover:bg-[#3E8E41] text-white rounded-xl font-semibold shadow-md dark:shadow-emerald-950/20 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            Predict Fuel <ChevronRight className="w-5 h-5 pointer-events-none" />
          </button>
          
          <button
            onClick={onAboutClick}
            className="px-6 py-3 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-xl font-semibold hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            About Project <HelpCircle className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <div className="flex items-start gap-3 bg-white/50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-850">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-semibold text-zinc-805 dark:text-zinc-100 text-sm">Optimal Depth</h4>
               <p className="text-xs text-zinc-500 dark:text-zinc-400">Reduce drag, conserve energy</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-850">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
               <Droplet className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-semibold text-zinc-805 dark:text-zinc-100 text-sm">Fuel Savings</h4>
               <p className="text-xs text-zinc-500 dark:text-zinc-400">Saves up to 25% diesel</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-850">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
               <Sprout className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-semibold text-zinc-805 dark:text-zinc-100 text-sm">Carbon Relief</h4>
               <p className="text-xs text-zinc-500 dark:text-zinc-400">Eco-friendly green farming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Visual Telemetry Block */}
      <div className="lg:col-span-5 flex justify-center relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-300/20 dark:bg-emerald-800/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-300/20 dark:bg-lime-800/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="w-full max-w-[400px] bg-white dark:bg-zinc-850 p-6 sm:p-8 rounded-[32px] border-4 border-emerald-50 dark:border-zinc-800 shadow-2xl relative select-none transform hover:rotate-1 hover:scale-102 transition-transform duration-300">
          <div className="absolute top-4 right-4 text-emerald-850/10 dark:text-emerald-500/10">
            <Cpu className="w-24 h-24" />
          </div>

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
             <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2E7D32] dark:text-[#4CAF50]">System Diagnostic</span>
             <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 text-[10px] font-mono">
               Ensemble Core v1.0
             </span>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-36 h-36 bg-gradient-to-tr from-emerald-50 to-emerald-100 dark:from-zinc-800 dark:to-zinc-700/50 rounded-full flex items-center justify-center shadow-inner relative animate-wiggle">
              <Gauge className="w-16 h-16 text-[#2E7D32] dark:text-[#4CAF50]" />
              
              <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-white font-mono text-xs flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>ONLINE</span>
              </div>
            </div>

            <div className="mt-8 text-center space-y-1">
              <p className="text-sm font-semibold text-zinc-905 dark:text-zinc-100 font-sans">Gradient Boosting Machine</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Pre-compiled on 5,000 observations</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-850 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Test R² Score</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">~98.4%</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Residual MAE</p>
              <p className="text-xl font-bold text-zinc-805 dark:text-white">~0.32 L</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
