import { useState, useEffect } from "react";
import { Leaf, Sun, Moon } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check local preferences
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const tabs = [
    { id: "home", label: "Home" },
    { id: "predict", label: "Predict Fuel" },
    { id: "analytics", label: "Model Analytics" },
    { id: "about", label: "About Project" },
  ];

  return (
    <nav className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm border-b border-emerald-100 dark:border-zinc-800 px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
      <div 
        className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-lg sm:text-xl cursor-pointer select-none"
        onClick={() => setActiveTab("home")}
      >
        <Leaf className="w-6 h-6 animate-pulse" />
        <span className="font-sans tracking-tight">AgriFuel AI</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex gap-1 sm:gap-3 bg-emerald-50 dark:bg-zinc-800 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white/50 dark:hover:bg-zinc-700/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-zinc-100 cold-gray-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all duration-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-emerald-600" />}
        </button>
      </div>
    </nav>
  );
}
