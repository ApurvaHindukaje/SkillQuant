"use client";

import { useState } from 'react';
import { Plus, X, Zap } from 'lucide-react';

interface SkillInputProps {
  onAnalyze: (skills: string[]) => void;
  isLoading: boolean;
  buttonText?: string;
}

export default function SkillInput({ onAnalyze, isLoading, buttonText = "Analyze Stack" }: SkillInputProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={addSkill} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="e.g. Python, AWS, React..."
          className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#30363d] text-white rounded-lg px-3 py-2 transition-colors flex items-center justify-center"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="space-y-2 flex-grow overflow-y-auto mb-6 max-h-[300px] scrollbar-hide">
        {skills.map(skill => (
          <div key={skill} className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2">
            <span className="text-sm font-medium text-gray-200">{skill}</span>
            <button 
              onClick={() => removeSkill(skill)}
              className="text-gray-500 hover:text-rose-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {skills.length === 0 && <p className="text-sm text-gray-500 italic">No assets loaded.</p>}
      </div>

      <button 
        onClick={() => onAnalyze(skills)}
        disabled={isLoading || skills.length === 0}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#30363d] text-white font-bold rounded-lg transition-colors flex justify-center items-center shadow-[0_0_15px_rgba(99,102,241,0.2)] mt-auto"
      >
        <Zap size={18} className="mr-2" /> {isLoading ? "Processing..." : buttonText}
      </button>
    </div>
  );
}
