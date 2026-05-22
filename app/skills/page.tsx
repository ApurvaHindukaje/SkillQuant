"use client";

import { BarChart2 } from 'lucide-react';
import SkillMarketBubbleMap from '@/modules/skills/components/SkillMarketBubbleMap';

export default function SkillsMarketPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#30363d] gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart2 className="mr-2 text-blue-500" /> Skill Market Map
          </h1>
          <p className="text-gray-400 text-sm mt-1">Discover undervalued skills and avoid overhyped markets</p>
        </div>
        
        <div className="flex space-x-2">
            <div className="flex items-center text-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-60 mr-2"></span> Undervalued
            </div>
            <div className="flex items-center text-xs ml-4">
              <span className="w-3 h-3 rounded-full bg-sky-500 opacity-60 mr-2"></span> Fair Value
            </div>
            <div className="flex items-center text-xs ml-4">
              <span className="w-3 h-3 rounded-full bg-red-500 opacity-60 mr-2"></span> Overhyped
            </div>
        </div>
      </header>

      <div className="glass-panel p-6 flex flex-col">
          <p className="text-sm text-gray-400 mb-6">
            This visualization acts like a financial bubble map. <strong>X-axis:</strong> Salary (LPA). <br/>
            <strong>Y-axis:</strong> YoY Growth Projection. <strong>Bubble Size:</strong> Market Demand Volume.
          </p>
          
          <div className="flex-1 min-h-[500px]">
             <SkillMarketBubbleMap />
          </div>
      </div>
    </div>
  );
}
