"use client";

import { useEffect, useState } from 'react';
import SkillDemandChart from '@/modules/skills/components/SkillDemandChart';
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, TrendingDown, Filter } from 'lucide-react';

type SortOption = 'spi' | 'salary' | 'saturation';

export default function DashboardPage() {
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [marketStats, setMarketStats] = useState({ avgSpi: 0, highDemandSpi: 0, totalSkills: 0 });
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [sortParam, setSortParam] = useState<SortOption>('spi');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/skills/index');
        const { data } = await res.json();
        if (data) {
          const sortedByGrowth = [...data].sort((a, b) => b.growth_rate - a.growth_rate);
          setTopGainers(sortedByGrowth.slice(0, 5));
          setTopLosers(sortedByGrowth.reverse().slice(0, 5));
          setAllSkills(data);
          
          setMarketStats({
            avgSpi: data.reduce((sum: number, i: any) => sum + i.skill_price_index, 0) / data.length,
            highDemandSpi: data[0]?.skill_price_index || 0,
            totalSkills: data.length
          });
        }
      } catch (e) { console.error(e); }
    }
    fetchStats();
  }, []);

  const sortedSkills = [...allSkills].sort((a, b) => {
    if (sortParam === 'spi') return b.skill_price_index - a.skill_price_index;
    if (sortParam === 'salary') return b.salary_average_lpa - a.salary_average_lpa;
    if (sortParam === 'saturation') return a.saturation_level - b.saturation_level; // lower saturation is theoretically better, or just high to low:
    return b.saturation_level - a.saturation_level;
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pb-4 border-b border-[#30363d]">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Activity className="mr-2 text-blue-500" /> Market Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time developer skill market analytics</p>
        </div>
        
        <div className="flex space-x-4">
           <div className="glass-panel px-4 py-2 flex flex-col items-end">
             <span className="text-xs text-gray-400">Avg Market SPI</span>
             <span className="font-mono font-bold text-green-400">{marketStats.avgSpi.toFixed(2)}</span>
           </div>
           <div className="glass-panel px-4 py-2 flex flex-col items-end">
             <span className="text-xs text-gray-400">Total Assets Tracked</span>
             <span className="font-mono font-bold text-blue-400">{marketStats.totalSkills}</span>
           </div>
        </div>
      </header>

      {/* Quick Asset Lookup */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">Quick Asset Lookup</h2>
        <input 
          type="text" 
          placeholder="Search for a skill (e.g. React, Python)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        
        {(() => {
          const searchedSkill = searchQuery.trim() ? allSkills.find(s => s.name.toLowerCase() === searchQuery.toLowerCase().trim()) : null;
          return searchedSkill ? (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
              <div>
                 <p className="text-xs text-gray-400">Asset</p>
                 <p className="font-bold text-lg text-blue-400">{searchedSkill.name}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400">Demand Score</p>
                 <p className="font-bold text-lg text-gray-200">{searchedSkill.demand_score.toFixed(1)}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400">Saturation Level</p>
                 <p className="font-bold text-lg text-gray-200">{searchedSkill.saturation_level.toFixed(2)}%</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400">Avg Salary</p>
                 <p className="font-bold text-lg text-green-400">₹{searchedSkill.salary_average_lpa.toFixed(1)} LPA</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400">Growth Rate</p>
                 <p className={`font-bold text-lg ${searchedSkill.growth_rate > 0 ? 'text-green-500' : 'text-red-500'}`}>
                   {(searchedSkill.growth_rate > 0 ? '+' : '')}{(searchedSkill.growth_rate * 100).toFixed(1)}%
                 </p>
              </div>
              <div>
                 <p className="text-xs text-gray-400">Market Price (SPI)</p>
                 <p className="font-bold text-lg text-purple-400">{searchedSkill.skill_price_index.toFixed(2)}</p>
              </div>
            </div>
          ) : (searchQuery.trim() && (
            <p className="mt-4 text-sm text-red-400">No asset found matching "{searchQuery}"</p>
          ));
        })()}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Top Tech Demand (Volume)</h2>
          <div className="flex-1">
            <SkillDemandChart />
          </div>
        </div>

        <div className="space-y-6">
            <div className="glass-panel p-6 h-[190px] overflow-y-auto">
              <h2 className="text-sm font-semibold mb-3 flex items-center text-green-400">
                <TrendingUp size={16} className="mr-2" /> Top Gainers
              </h2>
              <div className="space-y-3">
                {topGainers.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-sm border-b border-[#30363d] pb-2 last:border-0 last:pb-0">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-green-500 font-mono">+{((s.growth_rate)*100).toFixed(1)}%</span>
                  </div>
                ))}
                {topGainers.length === 0 && <span className="text-xs text-gray-500">Loading metrics...</span>}
              </div>
            </div>

            <div className="glass-panel p-6 h-[190px] overflow-y-auto">
              <h2 className="text-sm font-semibold mb-3 flex items-center text-red-400">
                <TrendingDown size={16} className="mr-2" /> Top Losers
              </h2>
              <div className="space-y-3">
                {topLosers.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-sm border-b border-[#30363d] pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-300">{s.name}</span>
                    <span className="text-red-500 font-mono">{((s.growth_rate)*100).toFixed(1)}%</span>
                  </div>
                ))}
                {topLosers.length === 0 && <span className="text-xs text-gray-500">Loading metrics...</span>}
              </div>
            </div>
        </div>
      </div>
      
      {/* Table view of top SPI */}
      <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold flex items-center">Skill Market Index (SPI) Ranking - Top 50</h2>
             <div className="flex items-center space-x-2 text-sm">
                <Filter size={14} className="text-gray-400" />
                <span className="text-gray-400">Sort By:</span>
                <select 
                   value={sortParam} 
                   onChange={(e) => setSortParam(e.target.value as SortOption)}
                   className="bg-[#0d1117] border border-[#30363d] text-gray-200 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors"
                >
                   <option value="spi">Market Price (SPI)</option>
                   <option value="salary">Average Salary (LPA)</option>
                   <option value="saturation">Saturation Level</option>
                </select>
             </div>
          </div>
          <div className="overflow-x-auto text-sm max-h-[600px] overflow-y-auto relative">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-[#30363d] text-gray-400">
                      <th className="py-3 px-4 font-medium">Asset</th>
                      <th className="py-3 px-4 font-medium">Category</th>
                      <th className="py-3 px-4 font-medium text-right">Market Price (SPI)</th>
                      <th className="py-3 px-4 font-medium text-right">Avg Salary (LPA)</th>
                      <th className="py-3 px-4 font-medium text-right">Saturation %</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]/50">
                    {sortedSkills.length > 0 ? sortedSkills.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-[#1f2937]/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-blue-400 flex items-center">
                              <span className="text-gray-500 w-6 font-mono text-xs">{idx + 1}.</span> {s.name}
                            </td>
                            <td className="py-3 px-4 text-gray-400">{s.category}</td>
                            <td className="py-3 px-4 text-right font-mono text-gray-200">{s.skill_price_index.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right font-mono flex items-center justify-end text-green-400">₹{s.salary_average_lpa.toFixed(1)}</td>
                            <td className="py-3 px-4 text-right text-gray-400">{s.saturation_level.toFixed(2)}%</td>
                        </tr>
                    )) : (
                        <tr><td colSpan={5} className="py-4 text-center text-gray-500">Loading order book...</td></tr>
                    )}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
}
