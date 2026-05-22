"use client";

import { useState } from 'react';
import { AlertOctagon, Skull, Activity, ShieldAlert } from 'lucide-react';
import SkillInput from '@/modules/skills/components/SkillInput';
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

export default function AIThreatMatrixPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (selectedSkills: string[]) => {
    setSkills(selectedSkills);
    if (selectedSkills.length === 0) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSkills: selectedSkills })
      });
      const data = await res.json();
      if (!data.error) setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getRiskColor = (riskStr: string) => {
    const risk = parseFloat(riskStr);
    if (risk > 75) return 'text-red-500 font-bold';
    if (risk > 50) return 'text-amber-500 font-bold';
    return 'text-emerald-500 font-bold';
  };

  const getRiskGradient = (riskStr: string) => {
    const risk = parseFloat(riskStr);
    if (risk > 75) return 'from-red-900/40 to-black/80';
    if (risk > 45) return 'from-amber-900/40 to-black/80';
    return 'from-emerald-900/40 to-black/80';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
         callbacks: { label: (ctx:any) => `Market Utility: ${ctx.raw}%` }
      }
    },
    scales: {
      y: { 
         grid: { color: 'rgba(48, 54, 61, 0.5)' }, 
         ticks: { color: '#8b949e', callback: (v:any) => `${v}%` },
         min: 0,
         max: 100
      },
      x: { grid: { display: false }, ticks: { color: '#8b949e' } }
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pb-4 border-b border-[#30363d]">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <AlertOctagon className="mr-2 text-rose-500" /> AI Threat Matrix
          </h1>
          <p className="text-gray-400 text-sm mt-1">Existential risk analysis calculating specific 10-year skill obsolescence.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 glass-panel p-6 h-fit shrink-0">
          <h2 className="text-lg font-bold mb-4 text-gray-200">1. Select Payload</h2>
          <SkillInput onAnalyze={handleAnalyze} isLoading={loading} buttonText="Simulate Extinction" />
        </div>

        <div className="lg:col-span-3 min-h-[500px] flex flex-col">
          {result ? (
            <div className={`glass-panel border-red-500/20 flex-grow bg-gradient-to-b ${getRiskGradient(result.overallRiskScore)} p-8 animate-in fade-in duration-500 flex flex-col`}>
               
               <div className="flex flex-col lg:flex-row justify-between items-center mb-8 border-b border-[#30363d] pb-8">
                  <div>
                     <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">Average Stack Obsolescence</h3>
                     <h2 className={`text-5xl font-black tracking-tighter flex items-center ${getRiskColor(result.overallRiskScore)}`}>
                        {result.overallRiskScore}% <span className="text-sm ml-4 font-normal tracking-normal text-gray-400">Risk Severity</span>
                     </h2>
                  </div>
                  <div className="mt-6 lg:mt-0 text-right bg-[#0d1117] p-4 rounded-xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                     <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 flex items-center justify-end"><Skull size={14} className="mr-2 text-rose-500"/> System Verdict</p>
                     <p className="font-mono text-sm text-gray-200">
                        {parseFloat(result.overallRiskScore) > 70 ? "CRITICAL VULNERABILITY: Pivot Immediately" : 
                         parseFloat(result.overallRiskScore) > 40 ? "MODERATE EXPOSURE: Begin scaling immunity" :
                         "SECURE: Highly defended architecture"}
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                  {/* Vulnerability Tree */}
                  <div>
                     <h4 className="font-bold flex items-center text-gray-300 mb-4 border-b border-[#30363d] pb-2">
                        <ShieldAlert size={18} className="mr-2 text-rose-500" /> Micro-Asset Threat Score
                     </h4>
                     <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
                        {result.analyzedSkills.map((s:any, i:number) => (
                           <div key={i} className={`flex justify-between items-center bg-[#0d1117]/80 p-3 rounded-lg border ${s.isImmune ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
                              <div>
                                 <p className="text-sm font-bold text-gray-200">{s.name}</p>
                                 <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.category}</p>
                              </div>
                              <div className="text-right">
                                 <p className={`font-mono font-bold ${getRiskColor(s.aiRiskScore)}`}>
                                    {s.aiRiskScore}%
                                 </p>
                                 <p className="text-[10px] text-gray-600">{s.isImmune ? 'AI Immune' : 'Subject to LLM displacement'}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 10 Year Decay Chart */}
                  <div className="glass-panel p-4 lg:p-6 bg-[#0d1117]">
                     <h4 className="font-bold flex items-center text-gray-300 mb-4 border-b border-[#30363d] pb-2">
                        <Activity size={18} className="mr-2 text-blue-500" /> 10-Year Biological Survival Curve
                     </h4>
                     <p className="text-xs text-gray-500 mb-4">Projecting the market utility of your current skill combinations adjusting for compounding AI agent pressure.</p>
                     <div className="w-full h-[200px]">
                        <Line 
                           data={{
                              labels: result.survivalCurve.map((d:any) => d.year),
                              datasets: [{
                                 label: 'Market Utility',
                                 data: result.survivalCurve.map((d:any) => d.utility),
                                 borderColor: 'rgba(239, 68, 68, 1)',
                                 backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                 borderWidth: 2,
                                 fill: true,
                                 tension: 0.4,
                                 pointRadius: 3
                              }]
                           }}
                           options={chartOptions as any}
                        />
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500 glass-panel border border-[#30363d]">
               <AlertOctagon size={48} className="text-[#30363d] mb-4" />
               <p>Awaiting skill array to calculate existential threat vectors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
