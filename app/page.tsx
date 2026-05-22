import Link from 'next/link';
import { ArrowRight, Activity, PieChart, ShieldAlert, Route, Layers, Gem, Hourglass, Shield, Compass, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto py-8">
      {/* Hero Section */}
      <section className="glass-panel p-8 md:p-12 text-center rounded-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0 pointer-events-none" />
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Real-time Market Data
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">SkillQuant</span> Terminal
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed font-light mt-4">
            Master your tech career. We analyze developer ecosystem datasets, GitHub repositories, and job markets 
            to simulate the precise economic value and growth trajectory of your technical skills.
          </p>
          
          <div className="flex flex-wrap flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              href="/dashboard" 
              className="flex w-full sm:w-auto items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
            >
              <Activity size={20} />
              <span>Launch Terminal</span>
            </Link>
            
            <Link 
              href="/portfolio" 
              className="flex w-full sm:w-auto items-center justify-center space-x-2 bg-[#1e293b] hover:bg-[#334155] border border-[#3c4a5c] text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              <span>Analyze My Skills</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Navigation Grid */}
      <h2 className="text-2xl font-bold mt-4 px-2">Explore SkillQuant Tools</h2>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Dashboard */}
        <Link href="/dashboard" className="glass-panel p-6 rounded-xl hover:border-blue-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Dashboard</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">Track the absolute market value of technical skills with our proprietary Skill Price Index tracking demand and salary vs saturation.</p>
        </Link>
        
        {/* My Skills (Portfolio) */}
        <Link href="/portfolio" className="glass-panel p-6 rounded-xl hover:border-purple-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">My Skills</h3>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <PieChart size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">Treat your skill set like an investment portfolio. We calculate risk level, market value score, and compounding growth projections.</p>
        </Link>

        {/* Roadmap */}
        <Link href="/roadmap" className="glass-panel p-6 rounded-xl hover:border-emerald-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Roadmap</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Route size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">View a comprehensive visual guide of technology learning paths, from foundational skills to advanced architectural specializations.</p>
        </Link>

        {/* Opportunities (Arbitrage) */}
        <Link href="/arbitrage" className="glass-panel p-6 rounded-xl hover:border-amber-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Opportunities</h3>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Gem size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">Find 'Alpha' in the job market. Identify high-paying, high-demand skills that are currently under-saturated with low competition.</p>
        </Link>

        {/* Learning ROI (Time to yield) */}
        <Link href="/time-to-yield" className="glass-panel p-6 rounded-xl hover:border-cyan-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Learning ROI</h3>
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
              <Hourglass size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">Calculate the Return on Investment for learning new technologies based on the expected salary bump versus the time required to master it.</p>
        </Link>

        {/* Career Moat */}
        <Link href="/moat" className="glass-panel p-6 rounded-xl hover:border-indigo-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Career Moat</h3>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Shield size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">Assess the long-term viability of your capabilities and build a defensive "career moat" against rapid technological shifts.</p>
        </Link>

        {/* Future Skills (Radar) */}
        <Link href="/radar" className="glass-panel p-6 rounded-xl hover:border-pink-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Future Skills</h3>
            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
              <Compass size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">See what's coming next. Track emerging technologies and assess early-adopter advantages before market saturation occurs.</p>
        </Link>

        {/* Stack Builder */}
        <Link href="/stack-builder" className="glass-panel p-6 rounded-xl hover:border-teal-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Stack Builder</h3>
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
              <Layers size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">Construct highly synergetic combinations of tools (e.g. Next.js + Prisma + TypeScript) that yield higher market value than isolated skills.</p>
        </Link>

        {/* AI Automation Risk (AI Threat) */}
        <Link href="/ai-threat" className="glass-panel p-6 rounded-xl hover:border-red-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">AI Automation Risk</h3>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <ShieldAlert size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">Avoid the AI bubble. Our machine learning models detect saturated technologies and roles at high risk of generative AI automation.</p>
        </Link>
        
        {/* College Insights */}
        <Link href="/college-insights" className="glass-panel p-6 rounded-xl hover:border-blue-500/50 transition-colors group block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">College Insights</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <GraduationCap size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-400">Discover top recruiter profiles, expected packages, and personalized learning roadmaps mapped to your institution.</p>
        </Link>

      </section>
    </div>
  );
}
