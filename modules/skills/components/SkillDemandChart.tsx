"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SkillDemandChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/skills?limit=25');
        const { data } = await res.json();
        
        if (data && data.length > 0) {
          const sortedData = [...data].sort((a: any, b: any) => b.demand_score - a.demand_score);
          
          setChartData({
            labels: sortedData.map((d: any) => d.name),
            datasets: [
              {
                label: 'Demand Score',
                data: sortedData.map((d: any) => d.demand_score),
                backgroundColor: 'rgba(14, 165, 233, 0.8)', // Primary blue
                borderColor: 'rgba(14, 165, 233, 1)',
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to load skills", error);
      }
    }
    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e6edf3'
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(48, 54, 61, 0.5)'
        },
        ticks: { color: '#8b949e' }
      },
      x: {
        grid: {
          display: false
        },
        ticks: { color: '#8b949e' }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-full">
      {chartData ? <Bar data={chartData} options={options as any} /> : <div className="animate-pulse h-full bg-slate-800 rounded"></div>}
    </div>
  );
}
