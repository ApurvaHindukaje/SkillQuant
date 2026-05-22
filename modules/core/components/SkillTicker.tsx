"use client";

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface TickerItem {
  id: string;
  name: string;
  skill_price_index: number;
  growth_rate: number;
  salary_average_lpa: number;
}

export default function SkillTicker() {
  const [skills, setSkills] = useState<TickerItem[]>([]);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch('/api/skills/index');
        const data = await res.json();
        // Just take top 10 for the ticker
        if (data.data) {
          setSkills(data.data.slice(0, 15));
        }
      } catch (e) {
        console.error("Failed to load ticker");
      }
    }
    fetchTicker();
  }, []);

  if (skills.length === 0) return null;

  return (
    <div className="w-full bg-[#161b22] border-b border-[#30363d] overflow-hidden flex items-center h-12 relative shadow-lg">
      <div className="absolute left-0 z-10 bg-gradient-to-r from-[#161b22] via-[#161b22] to-transparent w-48 h-full flex items-center px-4">
        <Activity size={16} className="text-blue-500 mr-2" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">LIVE</span>
          <span className="text-[9px] text-gray-500">Source: Stack Overflow & GitHub API</span>
        </div>
      </div>
      
      <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap pl-48">
        {skills.concat(skills).map((skill, i) => (
          <div key={`${skill.id}-${i}`} className="inline-flex items-center mx-6 space-x-2">
            <span className="font-semibold text-gray-200">{skill.name}</span>
            <span className="text-gray-400 font-mono text-sm">{skill.skill_price_index.toFixed(2)}</span>
            <span className="text-blue-400 font-mono text-xs">{skill.salary_average_lpa.toFixed(1)} LPA</span>
            <span className={`flex items-center text-xs font-bold ${skill.growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {skill.growth_rate >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(skill.growth_rate * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
