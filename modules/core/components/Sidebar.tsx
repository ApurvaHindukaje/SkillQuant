"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Briefcase, 
  BarChart2, 
  Compass, 
  Layers, 
  Route, 
  Gem, 
  Hourglass, 
  Shield, 
  AlertOctagon,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = () => setIsOpen(false);

  // Helper to determine if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#161b22] border-b border-[#30363d] sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight" onClick={closeSidebar}>
          <Layers className="text-blue-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SkillQuant
          </span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white p-2 rounded-lg bg-[#21262d] focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 hidden md:flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight" onClick={closeSidebar}>
            <Layers className="text-blue-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              SkillQuant
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto pb-6">
          <Link 
            href="/dashboard" 
            onClick={closeSidebar}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-[#21262d] text-blue-400' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'}`}
          >
            <Activity size={18} />
            <span>Dashboard</span>
          </Link>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Explore
          </div>

          <Link 
            href="/skills" 
            onClick={closeSidebar}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive('/skills') ? 'bg-[#21262d] text-blue-400' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'}`}
          >
            <BarChart2 size={18} />
            <span>Skill Explorer</span>
          </Link>
          <Link 
            href="/forecast" 
            onClick={closeSidebar}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive('/forecast') ? 'bg-[#21262d] text-blue-400' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'}`}
          >
            <Compass size={18} />
            <span>Future Skills</span>
          </Link>
          <Link 
            href="/roadmap" 
            onClick={closeSidebar}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive('/roadmap') ? 'bg-[#21262d] text-blue-400' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'}`}
          >
            <Route size={18} />
            <span>Roadmap</span>
          </Link>

          <Link 
            href="/college-insights" 
            onClick={closeSidebar}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive('/college-insights') ? 'bg-[#21262d] text-blue-400' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'}`}
          >
            <GraduationCap size={18} />
            <span>College Insights</span>
          </Link>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Strategy
          </div>

          <Link 
            href="/stack-builder" 
            onClick={closeSidebar}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive('/stack-builder') ? 'bg-[#21262d] text-blue-400' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'}`}
          >
            <Layers size={18} />
            <span>Stack Builder</span>
          </Link>
          <Link 
            href="/time-to-yield" 
            onClick={closeSidebar}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive('/time-to-yield') ? 'bg-[#21262d] text-blue-400' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'}`}
          >
            <Hourglass size={18} />
            <span>Learning ROI</span>
          </Link>
          <Link 
            href="/ai-threat" 
            onClick={closeSidebar}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive('/ai-threat') ? 'bg-[#21262d] text-blue-400' : 'text-gray-300 hover:bg-[#21262d] hover:text-white'}`}
          >
            <AlertOctagon size={18} />
            <span>AI Automation Risk</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-[#30363d] text-xs text-gray-500 text-center relative z-10 bg-[#161b22]">
          SkillQuant v1.0.0
        </div>
      </aside>
    </>
  );
}
