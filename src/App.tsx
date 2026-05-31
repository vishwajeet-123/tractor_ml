import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PredictorForm from "./components/PredictorForm";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AboutProject from "./components/AboutProject";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");

  return (
    <div className="min-h-screen bg-[#F5FFF5] dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300 font-sans flex flex-col">
      {/* Dynamic Header / Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Containers */}
      <main className="flex-grow">
        {activeTab === "home" && (
          <div className="space-y-4">
            <Hero 
              onPredictClick={() => setActiveTab("predict")} 
              onAboutClick={() => setActiveTab("about")} 
            />
          </div>
        )}

        {activeTab === "predict" && (
          <div className="py-4">
            <PredictorForm />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="py-4">
            <AnalyticsDashboard />
          </div>
        )}

        {activeTab === "about" && (
          <div className="py-4">
            <AboutProject />
          </div>
        )}
      </main>

      {/* Dynamic Agricultural Brand Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-emerald-100 dark:border-zinc-850 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 AgriFuel AI System. Designed with Precision & Sustainability.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>Model: Gradient Boosting Ensemble</span>
            <span className="text-[#2E7D32] dark:text-[#4CAF50]">● STATUS: ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

