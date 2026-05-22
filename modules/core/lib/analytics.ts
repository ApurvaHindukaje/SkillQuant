// lib/analytics.ts

export const calculateSkillPriceIndex = (
  demandScore: number,
  growthRate: number,
  salaryPremiumLpa: number,
  saturationLevel: number
): number => {
  // SkillPrice = (DemandScore * GrowthRate * SalaryPremium) / Saturation
  // Assuming inputs are normalized (0 to 1) or proper scales.
  // Use 1 + growthRate to ensure stable multiplier even for 0 or negative growth
  const safeGrowth = 1 + growthRate;
  const safeSaturation = saturationLevel > 0 ? saturationLevel : 0.01;
  return (demandScore * safeGrowth * salaryPremiumLpa) / safeSaturation;
};

export const calculateMomentumScore = (history: { demand_percentage: number, year: number }[]): number => {
  if (history.length < 2) return 0;
  // Sort by year ascending
  const sorted = [...history].sort((a, b) => a.year - b.year);
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  
  return ((newest.demand_percentage - oldest.demand_percentage) / oldest.demand_percentage) * 100;
};
