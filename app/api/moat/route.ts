import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function POST(request: Request) {
  try {
    const { userSkills } = await request.json();

    if (!userSkills || userSkills.length === 0) {
      return NextResponse.json({ error: 'Please submit your skill stack.' }, { status: 400 });
    }

    const skills = await prisma.skill.findMany({
      where: { name: { in: userSkills, mode: 'insensitive' } }
    });

    if (skills.length === 0) {
      return NextResponse.json({ error: 'Skills not found in market database.' }, { status: 404 });
    }

    // 1. Calculate Moat (Defensibility)
    // Low Saturation + High Difficulty Category = High Moat

    let totalDefensibility = 0;
    const evaluatedSkills = skills.map(s => {
      // Saturation is 0-100. Inverse is 100 - saturation.
      let categoryMultiplier = 1.0;
      const cat = s.category.toLowerCase();
      
      // Weighting categories by historical barrier-to-entry
      if (cat.includes('ai') || cat.includes('machine learning') || cat.includes('web3') || cat.includes('blockchain') || cat.includes('rust') || cat.includes('c++')) {
        categoryMultiplier = 1.8;
      } else if (cat.includes('data engineering') || cat.includes('devops') || cat.includes('cloud') || cat.includes('system')) {
        categoryMultiplier = 1.5;
      } else if (cat.includes('backend') || cat.includes('database')) {
        categoryMultiplier = 1.2;
      } else if (cat.includes('frontend') || cat.includes('javascript') || cat.includes('web')) {
        categoryMultiplier = 0.8;
      }

      // Base defensibility out of 100 based heavily on how rare the skill is
      const rawDefensibility = (100 - s.saturation_level) * categoryMultiplier;
      const cappedDefensibility = Math.min(Math.max(rawDefensibility, 5), 100);
      
totalDefensibility += cappedDefensibility;

      return {
        name: s.name,
        category: s.category,
        defensibilityScore: cappedDefensibility.toFixed(1),
        isMoat: cappedDefensibility > 70 ? true : false
      };
    });

    // Average Moat Score
    const moatScore = Math.min(totalDefensibility / skills.length, 100);

    let moatStatus = "Shallow";
    if (moatScore > 85) moatStatus = "Impenetrable";
    else if (moatScore > 65) moatStatus = "Deep";
    else if (moatScore > 40) moatStatus = "Moderate";

    // 2. Recommend 3 highly defensible skills to build the moat
    const allSkills = await prisma.skill.findMany({
      where: { id: { notIn: skills.map(s => s.id) } },
      orderBy: { saturation_level: 'asc' }
    });

    // Filter highly paid, low saturation
    const recommendations = allSkills
      .filter(s => s.growth_rate > 0 && s.salary_average_lpa > 20)
      .slice(0, 3)
      .map(s => ({
        name: s.name,
        salary: s.salary_average_lpa,
        saturation: s.saturation_level
      }));

    return NextResponse.json({
      moatScore: moatScore.toFixed(1),
      moatStatus,
      evaluatedSkills: evaluatedSkills.sort((a,b) => parseFloat(b.defensibilityScore) - parseFloat(a.defensibilityScore)),
      recommendations
    });

  } catch (error) {
    console.error('Moat Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze tech debt moat.' }, { status: 500 });
  }
}
