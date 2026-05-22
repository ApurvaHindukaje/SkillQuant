"use client";

import { useState, useEffect } from 'react';
import { Hourglass, Target, CalendarDays, BookOpen } from 'lucide-react';

export default function TimeToYieldPage() {
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [targetSalary, setTargetSalary] = useState<number>(15);
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch('/api/skills?limit=100');
        const { data } = await res.json();
        if (data) setAvailableSkills(data.sort((a:any, b:any) => a.name.localeCompare(b.name)));
      } catch (e) {
        console.error(e);
      }
    }
    loadSkills();
  }, []);

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const calculateTimeline = async () => {
    if (selectedSkills.length === 0) {
      setResult(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/time-to-yield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSkills: selectedSkills,
          targetSalaryLPA: targetSalary
        })
      });
      const data = await res.json();
      if (!data.error) {
        setResult(data);
      } else {
        setResult({ isError: true, message: data.error });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSkills.length > 0) {
      const timeoutId = setTimeout(() => {
        calculateTimeline();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedSkills, targetSalary]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-11
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pb-4 border-b border-[#30363d]">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Hourglass className="mr-2 text-indigo-400" /> Time-to-Yield Matrix
          </h1>
          <p className="text-gray-400 text-sm mt-1">Mathematical countdown to your target salary based on skill complexity and overlap.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Input Panel */}
         <div className="lg:col-span-1 glass-panel p-6 space-y-6">
            <div>
               <h2 className="text-lg font-bold flex items-center text-gray-200 mb-4">
                 <Target size={18} className="mr-2 text-green-400" /> 1. Target Yield
               </h2>
               <div className="flex justify-between text-sm text-gray-400 mb-2">
                 <span>Target Compensation</span>
                 <span className="font-mono text-green-400 font-bold">₹{targetSalary} LPA</span>
               </div>
               <input 
                 type="range" 
                 min="5" 
                 max="80" 
                 step="1"
                 value={targetSalary} 
                 onChange={(e) => setTargetSalary(Number(e.target.value))}
                 className="w-full accent-green-500"
               />
               <p className="text-xs text-gray-500 mt-2">Adjust your desired compensation threshold.</p>
            </div>

            <div className="border-t border-[#30363d] pt-6">
               <h2 className="text-lg font-bold flex items-center text-gray-200 mb-4">
                 <BookOpen size={18} className="mr-2 text-blue-400" /> 2. Current Skill Base
               </h2>
               <div className="h-48 overflow-y-auto border border-[#30363d] rounded-lg p-2 bg-[#0d1117] space-y-1 scrollbar-hide">
                 {availableSkills.map(s => (
                   <label key={s.id} className="flex items-center space-x-2 p-1 hover:bg-[#21262d] rounded cursor-pointer transition-colors">
                     <input 
                       type="checkbox" 
                       checked={selectedSkills.includes(s.name)}
                       onChange={() => toggleSkill(s.name)}
                       className="accent-blue-500"
                     />
                     <span className="text-sm text-gray-300">{s.name}</span>
                   </label>
                 ))}
               </div>
            </div>

            <button 
               onClick={calculateTimeline}
               disabled={loading}
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#30363d] text-white font-bold rounded-lg transition-colors flex justify-center items-center"
            >
               <Hourglass size={18} className="mr-2" /> {loading ? "Computing Timeline..." : "Generate ETA"}
            </button>
         </div>

         {/* Output Panel */}
         <div className="lg:col-span-2 glass-panel p-6 min-h-[500px]">
            {result?.isError ? (
               <div className="w-full h-full flex flex-col items-center justify-center text-rose-500 min-h-[400px]">
                  <Target size={48} className="text-rose-500/50 mb-4" />
                  <p className="font-bold">{result.message}</p>
                  <p className="text-sm text-rose-400/80 mt-2">Try adjusting your Target Compensation threshold.</p>
               </div>
            ) : result ? (
               <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                        <p className="text-xs text-gray-500">Optimal Target Role</p>
                        <p className="text-lg font-bold text-gray-200 mt-1">{result.targetRole}</p>
                     </div>
                     <div className="bg-[#0d1117] border border-green-500/30 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-green-500"></div>
                        <p className="text-xs text-gray-500 pl-2">Expected Yield</p>
                        <p className="text-lg font-mono font-bold text-green-400 mt-1 pl-2">₹{result.actualSalary}L</p>
                     </div>
                     <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                        <p className="text-xs text-gray-500">Total Devotion Hours</p>
                        <p className="text-lg font-mono font-bold text-amber-400 mt-1">{result.totalHours} hrs</p>
                     </div>
                     <div className="bg-[#0d1117] border border-indigo-500/30 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-500"></div>
                        <p className="text-xs text-gray-500 pl-2">Market ETA</p>
                        <p className="text-lg font-bold text-indigo-400 mt-1 pl-2">{result.totalMonths} Months</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold flex items-center text-gray-200 border-b border-[#30363d] pb-2">
                        <CalendarDays size={18} className="mr-2" /> Actionable Gantt Timeline (Assuming 15hr/week)
                     </h3>
                     
                     <div className="relative pt-4 pb-8">
                        {/* Timeline Track */}
                        <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-[#30363d]"></div>

                        {result.milestones.map((milestone: any, idx: number) => {
                           const targetDate = new Date();
                           targetDate.setMonth(currentMonth + Math.floor(milestone.startMonthOffset));
                           
                           return (
                              <div key={idx} className="relative flex items-start mb-8 group">
                                 <div className={`w-14 h-14 rounded-full border-4 border-[#0d1117] ${milestone.isBaseline ? 'bg-emerald-500' : 'bg-indigo-500'} z-10 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]`}>
                                    {milestone.isBaseline ? <BookOpen size={20} /> : idx}
                                 </div>
                                 <div className={`ml-6 glass-panel p-5 flex-1 ${milestone.isBaseline ? 'border-emerald-500/30' : 'border-indigo-500/20'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                       <div>
                                          <h4 className="text-xl font-bold text-white">{milestone.role}</h4>
                                          <p className="text-sm font-mono text-green-400 mt-1">Expected Salary: ₹{milestone.salaryLPA} LPA</p>
                                          {!milestone.isBaseline && (
                                             <p className="text-xs text-indigo-400 mt-1">Timeline: {monthNames[targetDate.getMonth()]} {targetDate.getFullYear()}</p>
                                          )}
                                       </div>
                                       <div className="text-right">
                                          {!milestone.isBaseline ? (
                                             <>
                                                <p className="font-mono text-amber-400 text-sm font-bold">+{milestone.milestoneHours} hrs</p>
                                                <p className="text-xs text-gray-500 mt-1">{milestone.milestoneMonths} mos</p>
                                             </>
                                          ) : (
                                             <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-bold">Current Base</span>
                                          )}
                                       </div>
                                    </div>
                                    
                                    {milestone.skillsToLearn.length > 0 && (
                                       <div className="bg-[#0d1117]/50 rounded-lg p-3">
                                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Skills to Acquire</p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                             {milestone.skillsToLearn.map((s:any, i:number) => (
                                                <div key={i} className="flex justify-between items-center bg-[#161b22] p-2 rounded border border-[#30363d]">
                                                   <span className="text-sm text-gray-300 font-medium">{s.skill}</span>
                                                   <span className="text-xs font-mono text-gray-500">{s.hours}h</span>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    )}
                                    
                                    {!milestone.isBaseline && milestone.skillsToLearn.length > 0 && (
                                       <div className="w-full bg-[#0d1117] rounded-full h-1 mt-4">
                                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full" style={{ width: `${Math.min((milestone.milestoneHours / 200) * 100, 100)}%` }}></div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           );
                        })}

                        {result.milestones.length > 0 && result.totalHours > 0 && (
                           <div className="relative flex items-center mt-8">
                              <div className="w-12 h-12 rounded-full border-4 border-[#0d1117] bg-green-500 z-10 flex items-center justify-center text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                                 <Target size={20} />
                              </div>
                              <div className="ml-6">
                                 <p className="font-bold text-green-400 text-lg">Goal Verified</p>
                                 <p className="text-xs text-gray-400">Target Yield achieved in {result.totalMonths} months</p>
                              </div>
                           </div>
                        )}
                        
                        {(result.milestones.length === 0 || result.totalHours === 0) && (
                           <div className="text-center py-10">
                              <p className="text-green-500 font-bold">You already have the target skills. You are heavily undervalued.</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
                  <Hourglass size={48} className="text-[#30363d] mb-4" />
                  <p>Awaiting skill parameters to simulate timeline...</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
