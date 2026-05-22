"use client";

import { useEffect, useState } from 'react';

import { Compass, Zap } from 'lucide-react';
import EmergingSkillsChart from '@/modules/skills/components/EmergingSkillsChart';

export default function FutureSkillRadarPage() {
  const [topForecasts, setTopForecasts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchForecasts() {
      try {
        const res = await fetch('/api/skills/emerging');
        const { data } = await res.json();
        if (data) {
          setTopForecasts(data.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchForecasts();
  }, []);

  // Tailwind styling colors for the top 3 items
  const colors = [
    "from-amber-400 to-amber-600 text-amber-500 border-amber-500/30",
    "from-emerald-400 to-emerald-600 text-emerald-500 border-emerald-500/30",
    "from-blue-400 to-blue-600 text-blue-500 border-blue-500/30",
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pb-4 border-b border-[#30363d]">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Compass className="mr-2 text-amber-500" /> Future Skill Radar
          </h1>
          <p className="text-gray-400 text-sm mt-1">Predictive analysis for emerging technologies based on historical datasets</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Insights Panel */}
        <div className="glass-panel p-6 col-span-1 h-fit flex flex-col space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center text-amber-400">
              <Zap size={18} className="mr-2" /> Top Forecasts
            </h2>
            <p className="text-sm text-gray-400 mb-4">The Machine Learning model forecasts highest YoY demand growth for these sectors next year.</p>
          </div>
          
          <div className="space-y-4">
             {topForecasts.length > 0 ? topForecasts.map((forecast: any, i: number) => (
               <div key={forecast.id} className={`p-4 bg-[#0d1117] border border-[#30363d] rounded-lg relative overflow-hidden group hover:border-${colors[i]?.split(' ')[2]?.split('-')[1] || 'gray'}-500/30 transition-colors`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colors[i]?.split(' ')[0]} ${colors[i]?.split(' ')[1]}`}></div>
                  <div className="flex justify-between items-center pl-2">
                     <span className="font-semibold text-gray-200">{forecast.name}</span>
                     <span className={`${colors[i]?.split(' ')[2]} font-mono font-bold`}>+{forecast.growthForecastPercentage.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 pl-2">Extrapolated from YoY metrics and demand scaling.</p>
               </div>
             )) : (
               <div className="animate-pulse flex flex-col gap-4">
                 <div className="h-16 bg-slate-800 rounded"></div>
                 <div className="h-16 bg-slate-800 rounded"></div>
               </div>
             )}
          </div>
        </div>

        {/* Chart Panel */}
        <div className="glass-panel p-6 col-span-1 md:col-span-2 flex flex-col min-h-[500px]">
           <h2 className="text-lg font-semibold mb-6 text-gray-200">Emerging Skills Forecast (1Y Projection)</h2>
           <EmergingSkillsChart />
           <p className="text-center text-xs text-gray-500 mt-4">
             Forecasts generated using scikit-learn time series models on historical GitHub vs StackOverflow datasets.
           </p>
        </div>
        
      </div>
    </div>
  );
}
