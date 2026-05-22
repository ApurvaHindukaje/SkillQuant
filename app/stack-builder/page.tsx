"use client";

import { useEffect, useState } from 'react';
import { Layers, Zap, TrendingUp, Cpu, Server, Database } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StackBuilderPage() {
  const [frontendSkills, setFrontendSkills] = useState<any[]>([]);
  const [backendSkills, setBackendSkills] = useState<any[]>([]);
  const [databaseSkills, setDatabaseSkills] = useState<any[]>([]);

  const [selectedFrontend, setSelectedFrontend] = useState('');
  const [selectedBackend, setSelectedBackend] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');

  const [stackResult, setStackResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch categorized assets on mount
  useEffect(() => {
    async function loadAssets() {
      try {
        const resFront = await fetch('/api/skills?category=Frontend&limit=30');
        const resBack = await fetch('/api/skills?category=Backend&limit=30');
        const resData = await fetch('/api/skills?category=Database&limit=30');
        
        const f = await resFront.json();
        const b = await resBack.json();
        const d = await resData.json();

        if (f.data) setFrontendSkills(f.data.sort((x:any, y:any) => x.name.localeCompare(y.name)));
        if (b.data) setBackendSkills(b.data.sort((x:any, y:any) => x.name.localeCompare(y.name)));
        if (d.data) setDatabaseSkills(d.data.sort((x:any, y:any) => x.name.localeCompare(y.name)));
      } catch (e) { console.error(e); }
    }
    loadAssets();
  }, []);

  const analyzeStack = async () => {
    if (!selectedFrontend || !selectedBackend || !selectedDatabase) return;
    setLoading(true);
    try {
      const res = await fetch('/api/stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontend: selectedFrontend,
          backend: selectedBackend,
          database: selectedDatabase
        })
      });
      const data = await res.json();
      if (!data.error) {
        setStackResult(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { color: '#e6edf3' } },
    },
    scales: {
      y: { grid: { color: 'rgba(48, 54, 61, 0.5)' }, ticks: { color: '#8b949e', callback: (value: any) => `₹${value} LPA` } },
      x: { grid: { display: false }, ticks: { color: '#8b949e' } }
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pb-4 border-b border-[#30363d]">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Layers className="mr-2 text-indigo-500" /> Tech Stack Alpha (Momentum Simulator)
          </h1>
          <p className="text-gray-400 text-sm mt-1">Combine distinctly categorized assets to project 5-year compounding ROI against the market baseline.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Frontend Selection */}
         <div className="glass-panel p-6 border-blue-500/20">
            <h2 className="text-lg font-bold flex items-center text-blue-400 mb-4">
               <Cpu size={18} className="mr-2" /> 1. Frontend Client
            </h2>
            <select 
               className="w-full bg-[#0d1117] border border-[#30363d] text-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors"
               value={selectedFrontend}
               onChange={(e) => setSelectedFrontend(e.target.value)}
            >
               <option value="" disabled>Select Client Framework...</option>
               {frontendSkills.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
         </div>

         {/* Backend Selection */}
         <div className="glass-panel p-6 border-emerald-500/20">
            <h2 className="text-lg font-bold flex items-center text-emerald-400 mb-4">
               <Server size={18} className="mr-2" /> 2. Backend Engine
            </h2>
            <select 
               className="w-full bg-[#0d1117] border border-[#30363d] text-gray-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 transition-colors"
               value={selectedBackend}
               onChange={(e) => setSelectedBackend(e.target.value)}
            >
               <option value="" disabled>Select Backend Runtime...</option>
               {backendSkills.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
         </div>

         {/* Database Selection */}
         <div className="glass-panel p-6 border-amber-500/20">
            <h2 className="text-lg font-bold flex items-center text-amber-400 mb-4">
               <Database size={18} className="mr-2" /> 3. Data Layer
            </h2>
            <select 
               className="w-full bg-[#0d1117] border border-[#30363d] text-gray-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 transition-colors"
               value={selectedDatabase}
               onChange={(e) => setSelectedDatabase(e.target.value)}
            >
               <option value="" disabled>Select Database System...</option>
               {databaseSkills.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
         </div>
      </div>

      <div className="flex justify-center">
         <button 
           onClick={analyzeStack}
           disabled={loading || !selectedFrontend || !selectedBackend || !selectedDatabase}
           className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#30363d] disabled:text-gray-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center"
         >
           <Zap size={18} className="mr-2" /> {loading ? "Simulating Ecosystem..." : "Compile Stack Architecture"}
         </button>
      </div>

      {stackResult && (
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-500">
            
            <div className="lg:col-span-1 space-y-6">
               <div className="glass-panel p-6">
                  <h3 className="text-xs font-mono text-gray-400 mb-1">Architecture Compiled</h3>
                  <p className="text-xl font-bold text-white mb-6 leading-tight">{stackResult.stackName}</p>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center pb-2 border-b border-[#30363d]">
                        <span className="text-sm text-gray-400">Current Yield (LPA)</span>
                        <span className="text-sm font-mono text-gray-200">₹{stackResult.analytics.startingLPA}</span>
                     </div>
                     <div className="flex justify-between items-center pb-2 border-b border-[#30363d]">
                        <span className="text-sm text-gray-400">Composite SPI</span>
                        <span className="text-sm font-mono text-indigo-400">{stackResult.analytics.avgSPI}</span>
                     </div>
                     <div className="flex justify-between items-center pb-2 border-b border-[#30363d]">
                        <span className="text-sm text-gray-400">Market Synergy</span>
                        <span className="text-sm font-mono text-blue-400">{stackResult.analytics.synergyScore} / 100</span>
                     </div>
                     <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-6">
                        <h4 className="flex items-center text-emerald-400 font-bold mb-1 text-sm"><TrendingUp size={16} className="mr-2" /> 5-Year Scaling</h4>
                        <p className="text-2xl font-bold font-mono text-white">₹{stackResult.analytics.fiveYearLPA} <span className="text-sm text-emerald-500">LPA</span></p>
                        <p className="text-xs text-emerald-500/80 mt-1">+{stackResult.analytics.projectedGrowthPercentage}% Outperformance</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-3 glass-panel p-6 h-[400px]">
               <h2 className="text-base font-semibold text-gray-200 mb-4 flex items-center">
                  Alpha Growth Trajectory vs Legacy Baseline
               </h2>
               <div className="w-full h-[300px]">
                 <Line 
                    data={{
                       labels: stackResult.chart.labels,
                       datasets: [
                          {
                             label: 'Custom Alpha Stack',
                             data: stackResult.chart.stackData,
                             borderColor: 'rgba(99, 102, 241, 1)',
                             backgroundColor: 'rgba(99, 102, 241, 0.2)',
                             borderWidth: 3,
                             pointRadius: 4,
                             pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                             fill: true,
                             tension: 0.3
                          },
                          {
                             label: 'Market Average Baseline',
                             data: stackResult.chart.baselineData,
                             borderColor: 'rgba(156, 163, 175, 0.5)',
                             borderWidth: 2,
                             borderDash: [5, 5],
                             pointRadius: 0,
                             tension: 0.3
                          }
                       ]
                    }} 
                    options={chartOptions as any} 
                 />
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
