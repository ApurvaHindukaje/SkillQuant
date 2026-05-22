import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function POST(request: Request) {
  try {
    const { frontend, backend, database } = await request.json();

    if (!frontend || !backend || !database) {
      return NextResponse.json({ error: 'Please select all 3 stack components.' }, { status: 400 });
    }

    // Fetch the 3 corresponding skills
    const skills = await prisma.skill.findMany({
      where: {
        name: { in: [frontend, backend, database], mode: 'insensitive' }
      },
      include: {
        trends: true
      }
    });

    if (skills.length < 3) {
      return NextResponse.json({ error: 'Some skills were not found in the database.' }, { status: 404 });
    }

    // 1. Calculate base aggregated metrics
    const currentSalaryLPA = skills.reduce((sum, s) => sum + s.salary_average_lpa, 0) / 3;
    const avgGrowthRate = skills.reduce((sum, s) => sum + s.growth_rate, 0) / 3;
    const avgDemand = skills.reduce((sum, s) => sum + s.demand_score, 0) / 3;
    const avgSPI = skills.reduce((sum, s) => sum + s.skill_price_index, 0) / 3;

    // Simulate standard baseline (e.g. legacy stack growth)
    const baselineGrowthRate = 0.04;

    // 2. Project exactly 5 years into the future using compounding interest math
    const currentYear = new Date().getFullYear();
    const projections = [];
    const baselineProjections = [];

    // Start year (Year 0)
    let projectedSalary = currentSalaryLPA;
    let baselineSalary = currentSalaryLPA; // Start them at the same point to clearly show divergence

    projections.push({ year: currentYear, salary: projectedSalary.toFixed(1) });
    baselineProjections.push({ year: currentYear, salary: baselineSalary.toFixed(1) });

    // Compound over next 5 years
    for (let i = 1; i <= 5; i++) {
      // Your custom stack compounds by the actual averaged growth potential of your assets
      projectedSalary = projectedSalary * (1 + avgGrowthRate);
      
      // The market average just compounds by standard inflation/legacy growth ~4%
      baselineSalary = baselineSalary * (1 + baselineGrowthRate);

      projections.push({ year: currentYear + i, salary: projectedSalary.toFixed(1) });
      baselineProjections.push({ year: currentYear + i, salary: baselineSalary.toFixed(1) });
    }

    // Bonus scaling multiplier: Multi-asset stacks exhibit non-linear networking effects. 
    // If the components have very high SPI, we reward the combined multiplier slightly.
    const stackMomentumMultiplier = 1 + (avgSPI / 500); // Small bonus scaler

    return NextResponse.json({
      stackName: `${frontend} + ${backend} + ${database}`,
      analytics: {
        startingLPA: currentSalaryLPA.toFixed(1),
        fiveYearLPA: (projectedSalary * stackMomentumMultiplier).toFixed(1),
        projectedGrowthPercentage: (((projectedSalary * stackMomentumMultiplier) - currentSalaryLPA) / currentSalaryLPA * 100).toFixed(1),
        synergyScore: (avgDemand * stackMomentumMultiplier).toFixed(0),
        avgSPI: avgSPI.toFixed(2),
      },
      chart: {
        labels: projections.map(p => p.year.toString()),
        stackData: projections.map((p, i) => i === 5 ? (parseFloat(p.salary) * stackMomentumMultiplier).toFixed(1) : p.salary),
        baselineData: baselineProjections.map(p => p.salary)
      }
    });

  } catch (error) {
    console.error('Stack calculation failed:', error);
    return NextResponse.json({ error: 'Internal server error analyzing tech stack.' }, { status: 500 });
  }
}
