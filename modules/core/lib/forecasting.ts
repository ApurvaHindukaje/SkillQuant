// lib/forecasting.ts

// Simple linear forecasting for skill demand next year
export const forecastSkillDemand = (history: { year: number, demand_percentage: number }[]): number => {
  if (history.length < 2) return history[0]?.demand_percentage || 0;

  history.sort((a, b) => a.year - b.year);
  
  const n = history.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  history.forEach(point => {
    sumX += point.year;
    sumY += point.demand_percentage;
    sumXY += point.year * point.demand_percentage;
    sumXX += point.year * point.year;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const nextYear = history[history.length - 1].year + 1;
  return slope * nextYear + intercept;
};
