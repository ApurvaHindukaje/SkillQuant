"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function EmergingSkillsChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/skills/emerging');
        const { data } = await res.json();
        
        if (data && data.length > 0) {
          const topEmerging = data.slice(0, 15); // Take top 15

          // Generate enough colors for the pie
          const colors = topEmerging.map((_: any, i: number) => `hsla(${(i * 360) / 15 + 180}, 70%, 60%, 0.6)`);

          setChartData({
            labels: topEmerging.map((d: any) => d.name),
            datasets: [
              {
                label: 'Growth Forecast %',
                data: topEmerging.map((d: any) => d.growthForecastPercentage),
                backgroundColor: colors,
                borderWidth: 1,
                borderColor: '#1e293b' // dark slate
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to load emerging skills", error);
      }
    }
    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#e6edf3' }
      }
    },
    scales: {
      r: {
        grid: { color: 'rgba(48, 54, 61, 0.5)' },
        ticks: { display: false, backdropColor: 'transparent' },
        pointLabels: { color: '#8b949e' }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[350px]">
      {chartData ? <PolarArea data={chartData} options={options} /> : <div className="animate-pulse h-full bg-slate-800 rounded"></div>}
    </div>
  );
}
