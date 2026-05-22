"use client";

import { useState, useEffect } from 'react';
import { Building, Search, Briefcase, GraduationCap, BarChart as BarChartIcon, Route } from 'lucide-react';
import { 
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, BubbleController 
} from 'chart.js';
import { Pie, Bar, Bubble } from 'react-chartjs-2';
import Mermaid from '@/modules/core/components/Mermaid';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, BubbleController);

export default function CollegeInsightsPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch list of colleges on mount
  useEffect(() => {
    async function loadColleges() {
      try {
        const res = await fetch('/api/college-insights');
        const list = await res.json();
        // Prevent TypeError if API fails and returns `{error: ...}` instead of array
        if (Array.isArray(list)) {
          setColleges(list);
        } else {
          console.error("API returned a non-array response:", list);
          setColleges([]);
        }
      } catch (e) {
        console.error("Error loading colleges", e);
      }
    }
    loadColleges();
  }, []);

  // Fetch detailed insights when college is selected
  useEffect(() => {
    if (!selectedCollegeId) return;

    async function fetchInsights() {
      setLoading(true);
      try {
        const res = await fetch(`/api/college-insights/${selectedCollegeId}`);
        const result = await res.json();
        setData(result);
      } catch (e) {
        console.error("Error fetching insights", e);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [selectedCollegeId]);

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Charts Data Preparation ---
  // 1. Pie Chart: Categories
  const categoryData = data ? {
    labels: Object.keys(data.stats.categoryBreakdown),
    datasets: [{
      data: Object.values(data.stats.categoryBreakdown),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b'],
      borderWidth: 0,
    }]
  } : null;

  // 2. Bar Chart: Frequencies
  const frequencyData = data ? {
    labels: Object.keys(data.stats.frequencyBreakdown),
    datasets: [{
      label: 'Number of Companies',
      data: Object.values(data.stats.frequencyBreakdown),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
    }]
  } : null;

  // 3. Horizontal Bar: Top Technologies
  const topTechData = data ? {
    labels: data.stats.topSkills.slice(0, 10).map((s:any) => s.skill),
    datasets: [{
      label: 'Demanded by N Companies',
      data: data.stats.topSkills.slice(0, 10).map((s:any) => s.count),
      backgroundColor: 'rgba(52, 211, 153, 0.8)',
      indexAxis: 'y' as const,
    }]
  } : null;

  // 4. Bubble Chart: Package vs Workload (Workload mapped to Y axis: Light=1, Mod=2, Heavy=3)
  const workloadMap: Record<string, number> = { "Light": 1, "Moderate": 2, "Heavy": 3 };
  const frequencyMap: Record<string, number> = { "Rare": 8, "Occasional": 15, "Regular": 25 }; // Bubble sizes
  
  const bubbleData = data ? {
    datasets: [{
      label: 'Companies',
      data: data.placements.map((p:any) => ({
        x: p.avgPackage, // x-axis: Salary
        y: workloadMap[p.workload] || 2, // y-axis: Workload
        r: frequencyMap[p.frequency] || 10, // bubble size: frequency
        company: p.companyName
      })),
      backgroundColor: 'rgba(236, 72, 153, 0.6)',
      borderColor: 'rgba(236, 72, 153, 1)',
    }]
  } : null;

  const bubbleOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const raw = context.raw;
            const yLabels = ["", "Light", "Moderate", "Heavy"];
            return `${raw.company}: ${raw.x} LPA, Workload: ${yLabels[raw.y]}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0, max: 4,
        ticks: { callback: function(value: any) { return ["", "Light", "Moderate", "Heavy", ""][value]; } }
      },
      x: { title: { display: true, text: 'Average Package (LPA)', color: '#9ca3af' } }
    }
  };

  // --- Dynamic Mermaid generation based on Top Skills ---
  // This takes the top 5 skills demanded at the college and creates a mini learning path map
  const generateRoadmap = () => {
    if (!data || data.stats.topSkills.length === 0) return '';
    const topSkills = data.stats.topSkills.slice(0, 5).map((s:any) => s.skill);
    
    let mermaidStr = `graph TD\n`;
    mermaidStr += `    classDef path fill:#1e293b,stroke:#a855f7,stroke-width:2px,color:#fff\n`;
    mermaidStr += `    classDef finish fill:#a855f7,stroke:#fff,stroke-width:2px,color:#fff\n\n`;
    mermaidStr += `    Start["Foundations (DS & Algo)"]:::path\n`;
    
    // Simplistic progression: DS -> Top Skill 1 -> Top Skill 2 etc...
    // In reality this would be driven by a robust DB mapping of prerequisites.
    let prev = 'Start';
    topSkills.forEach((skill: string, index: number) => {
      const safeId = skill.replace(/[^a-zA-Z]/g, ''); // Mermaid ids must be alphanumeric
      if (index === topSkills.length - 1) {
        mermaidStr += `    ${safeId}["${skill}"]:::finish\n`;
      } else {
        mermaidStr += `    ${safeId}["${skill}"]:::path\n`;
      }
      mermaidStr += `    ${prev} --> ${safeId}\n`;
      prev = safeId;
    });
    
    mermaidStr += `\n    ${prev} -.-> Target["Target: Top Tier Placement at ${data.college.name}"]\n`;
    mermaidStr += `    style Target fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff\n`;
    
    return mermaidStr;
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="pb-4 border-b border-[#30363d]">
        <h1 className="text-2xl font-bold flex items-center">
          <GraduationCap className="mr-2 text-indigo-500" /> College Placement Insights
        </h1>
        <p className="text-gray-400 text-sm mt-1">Discover recruiter profiles, expected packages, and personalized learning roadmaps for your institution.</p>
      </header>

      {/* College Selection Search block */}
      <div className="glass-panel p-6 flex flex-col md:flex-row gap-4 items-center z-20 relative">
        <div className="relative flex-1 w-full max-w-xl group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Search your college (e.g. COEP, VIT, PICT)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Dropdown list of filtered results */}
        {searchTerm && !selectedCollegeId && (
          <div className="absolute top-20 left-6 w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
            {filteredColleges.length > 0 ? filteredColleges.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCollegeId(c.id);
                  setSearchTerm(c.name);
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#21262d] text-gray-300 border-b border-[#30363d] last:border-0"
              >
                {c.name}
              </button>
            )) : (
              <div className="px-4 py-3 text-gray-500">No colleges found matching "{searchTerm}"</div>
            )}
          </div>
        )}

        <button 
          onClick={() => { setSelectedCollegeId(''); setSearchTerm(''); setData(null); }}
          className="bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-4 py-3 rounded-xl transition-colors"
        >
          Clear Selection
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {data && !loading && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 border-t-2 border-blue-500 rounded-xl">
               <p className="text-sm text-gray-500">Total Recruiters</p>
               <h3 className="text-3xl font-bold mt-1">{data.stats.totalCompanies}</h3>
            </div>
            <div className="glass-panel p-5 border-t-2 border-green-500 rounded-xl">
               <p className="text-sm text-gray-500">Avg. Package</p>
               <h3 className="text-3xl font-bold text-green-400 mt-1">₹{data.stats.averagePackage} LPA</h3>
            </div>
            <div className="glass-panel p-5 border-t-2 border-purple-500 rounded-xl">
               <p className="text-sm text-gray-500">Top Package</p>
               <h3 className="text-3xl font-bold text-purple-400 mt-1">₹{data.stats.topPackage} LPA</h3>
            </div>
            <div className="glass-panel p-5 border-t-2 border-emerald-500 rounded-xl">
               <p className="text-sm text-gray-500">#1 Top Skill Required</p>
               <h3 className="text-xl font-bold text-emerald-400 mt-2 truncate">{data.stats.topSkills[0]?.skill || '-'}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visualizations Grid */}
            <div className="space-y-6">
              <div className="glass-panel p-5 h-[300px]">
                <h3 className="font-semibold mb-2 text-gray-300">Company Categories</h3>
                <div className="h-[230px] w-full flex justify-center">
                  {categoryData && <Pie data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />}
                </div>
              </div>
              
              <div className="glass-panel p-5 h-[300px]">
                <h3 className="font-semibold mb-2 text-gray-300">Recruitment Frequency</h3>
                <div className="h-[230px] w-full">
                  {frequencyData && <Bar data={frequencyData} options={{ maintainAspectRatio: false, plugins: { legend: { display:false } } }} />}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel p-5 h-[300px]">
                <h3 className="font-semibold mb-2 text-gray-300">Top Recommended Technologies</h3>
                <div className="h-[230px] w-full">
                   {topTechData && <Bar data={topTechData} options={{ indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display:false } } }} />}
                </div>
              </div>

              <div className="glass-panel p-5 h-[300px]">
                <h3 className="font-semibold mb-2 text-gray-300">Risk vs Reward (Package vs Workload)</h3>
                <div className="h-[230px] w-full">
                  {bubbleData && <Bubble data={bubbleData} options={{...bubbleOptions, maintainAspectRatio: false }} />}
                </div>
              </div>
            </div>
          </div>

          {/* AI Generated Strategy Roadmap */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              <Route className="mr-2 text-purple-400" /> Auto-Generated Strategy Roadmap
            </h2>
            <p className="text-sm text-gray-400 mb-6">Based on the historical recruitment data from {data.college.name}, mastering this specialized progression line maximizes your probability of securing top tier placements.</p>
            <div className="w-full bg-[#0d1117] rounded-xl border border-[#30363d]/50 p-4">
              <Mermaid chart={generateRoadmap()} />
            </div>
          </div>

          {/* Detailed Recruiter Table */}
          <div className="glass-panel p-6 overflow-hidden">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Building className="mr-2 text-blue-400" /> Placement Track Record
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#161b22] text-gray-400 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-lg">Company</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Frequency</th>
                    <th className="px-4 py-3 font-semibold">Avg Package (LPA)</th>
                    <th className="px-4 py-3 font-semibold rounded-tr-lg">Key Skills</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  {data.placements.map((p:any, idx:number) => (
                    <tr key={idx} className="hover:bg-[#161b22]/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-white">{p.companyName}</td>
                      <td className="px-4 py-4">{p.category}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${p.frequency === 'Regular' ? 'bg-green-500/20 text-green-400' : p.frequency === 'Occasional' ? 'bg-amber-500/20 text-amber-500' : 'bg-rose-500/20 text-rose-400'}`}>
                          {p.frequency}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-green-400">{p.avgPackage}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {p.requiredSkills.slice(0, 3).map((skill:string, i:number) => (
                            <span key={i} className="bg-[#21262d] border border-[#30363d] px-2 py-1 rounded-md text-xs text-blue-300">
                              {skill}
                            </span>
                          ))}
                          {p.requiredSkills.length > 3 && <span className="text-xs text-gray-500 pt-1">+{p.requiredSkills.length - 3}</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
