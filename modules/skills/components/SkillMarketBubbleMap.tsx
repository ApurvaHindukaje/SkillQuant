"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function SkillMarketBubbleMap() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/skills/index');
        const { data } = await res.json();
        
        if (data && data.length > 0) {
          // X = Salary (LPA), Y = Growth Rate (%), R = Demand Score
          const mappedData = data.map((d: any) => ({
            x: d.salary_average_lpa,
            y: d.growth_rate * 100, // percentage display
            r: Math.max(5, d.demand_score / 2), // bubble size logic
            name: d.name,
            spi: d.skill_price_index,
            saturation_level: d.saturation_level
          }));

          setChartData({
            datasets: [
              {
                label: 'Skills Market',
                data: mappedData,
                backgroundColor: mappedData.map((d: any) => {
                  const hypedRatio = d.spi ? (d.spi / d.saturation_level) : 0; 
                  // Because SPI = (Demand * (1+Growth) * Salary) / Saturation
                  // Wait, earlier I stated: Hyped Ratio = Saturation / (True Value). 
                  // But we can just use the variables directly here to avoid confusion.
                  const isUnderhyped = (d.y > 15 && d.saturation_level < 20); // High Growth (>15%) & Low Saturation (<20%)
                  const isOverhyped = (d.saturation_level > 30 && d.y < 5); // High Saturation (>30%) & Stagnant/Negative Growth (<5%)
                  
                  return isUnderhyped ? 'rgba(16, 185, 129, 0.6)' : 
                         isOverhyped ? 'rgba(239, 68, 68, 0.6)' : 
                         'rgba(14, 165, 233, 0.6)';
                }),
                borderColor: mappedData.map((d: any) => {
                  const isUnderhyped = (d.y > 15 && d.saturation_level < 20);
                  const isOverhyped = (d.saturation_level > 30 && d.y < 5);
                  
                  return isUnderhyped ? 'rgb(16, 185, 129)' :
                         isOverhyped ? 'rgb(239, 68, 68)' :
                         'rgb(14, 165, 233)';
                }),
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to load skills bubble map", error);
      }
    }
    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const data = ctx.raw;
            return `${data.name} | Salary: ₹${data.x.toFixed(1)} LPA | Growth: ${data.y.toFixed(1)}% | SPI: ${data.spi.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Growth Rate (%)',
          color: '#8b949e'
        },
        grid: {
          color: 'rgba(48, 54, 61, 0.5)'
        },
        ticks: { color: '#8b949e' }
      },
      x: {
        title: {
          display: true,
          text: 'Average Salary (INR LPA)',
          color: '#8b949e'
        },
        grid: {
          color: 'rgba(48, 54, 61, 0.5)'
        },
        ticks: { color: '#8b949e' }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col relative">
      <div className="absolute top-2 right-4 flex space-x-4 text-xs font-medium z-10 bg-[#0d1117]/80 px-3 py-2 rounded-lg border border-[#30363d]">
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2 opacity-80"></span> Underhyped (High Growth, Lower Salary)</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2 opacity-80"></span> Overhyped (Low Growth, High Salary)</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-sky-500 mr-2 opacity-80"></span> Fair Value</div>
      </div>
      <div className="flex-1 mt-8">
        {chartData ? <Bubble data={chartData} options={options} /> : <div className="animate-pulse h-full bg-slate-800 rounded"></div>}
      </div>
    </div>
  );
}
