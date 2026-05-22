import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';
import { calculateSkillPriceIndex } from '@/modules/core/lib/analytics';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany();

    // Map through skills and calculate real-time Skill Price Index
    const indexData = skills.map(skill => {
      const spi = calculateSkillPriceIndex(
        skill.demand_score,
        skill.growth_rate,
        skill.salary_average_lpa,
        skill.saturation_level
      );
      
      return {
        ...skill,
        skill_price_index: spi,
      };
    });

    // Sort by Skill Price Index descending
    indexData.sort((a, b) => b.skill_price_index - a.skill_price_index);

    return NextResponse.json({ data: indexData });
  } catch (error) {
    console.error('Error fetching skill index:', error);
    return NextResponse.json(
      { error: 'Failed to calculate skill index' },
      { status: 500 }
    );
  }
}
