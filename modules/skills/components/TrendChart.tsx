"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TrendChart({ skillId }: { skillId?: string }) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = skillId ? `/api/trends?skillId=${skillId}` : '/api/trends';
        const res = await fetch(url);
        const { data } = await res.json();
        
        if (data && data.length > 0) {
          // Group by year or skill depending on the data
          // For simplicity, assuming a single skill trend being passed or aggregated
          const sorted = data.sort((a: any, b: any) => a.year - b.year);
          const labels = Array.from(new Set(sorted.map((d: any) => d.year)));
          
          setChartData({
            labels,
            datasets: [
              {
                label: 'Trend %',
                data: labels.map(year => {
                  const items = sorted.filter((d: any) => d.year === year);
                  const avg = items.reduce((sum: number, i: any) => sum + i.demand_percentage, 0) / (items.length || 1);
                  return avg;
                }),
                borderColor: '#10b981', // green
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.4, // smooth curves
                fill: true
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to load trends", error);
      }
    }
    fetchData();
  }, [skillId]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(48, 54, 61, 0.5)' },
        ticks: { color: '#8b949e' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#8b949e' }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      {chartData ? <Line data={chartData} options={options} /> : <div className="animate-pulse h-full bg-slate-800 rounded"></div>}
    </div>
  );
}
