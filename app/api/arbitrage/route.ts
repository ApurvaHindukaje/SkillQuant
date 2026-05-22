import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany();

    // Calculate Arbitrage Score: (Salary * Growth Rate) / Saturation
    // High salary, high growth, low saturation = High Arbitrage
    const arbitrageAssets = skills.map(skill => {
      // Prevent division by zero
      const safeSaturation = Math.max(skill.saturation_level, 0.1);
      const score = (skill.salary_average_lpa * skill.growth_rate * 100) / safeSaturation;

      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        salary: skill.salary_average_lpa,
        growth: skill.growth_rate,
        saturation: skill.saturation_level,
        arbitrageScore: score
      };
    });

    // Sort by highest arbitrage score
    arbitrageAssets.sort((a, b) => b.arbitrageScore - a.arbitrageScore);

    // Filter out completely dead skills
    const topArbitrage = arbitrageAssets.filter(a => a.growth > 0).slice(0, 10);

    return NextResponse.json({ data: topArbitrage });
  } catch (error) {
    console.error('Failed to fetch arbitrage data:', error);
    return NextResponse.json({ error: 'Failed to find market arbitrage.' }, { status: 500 });
  }
}
