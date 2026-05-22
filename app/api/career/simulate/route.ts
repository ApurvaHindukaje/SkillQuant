import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function POST(request: Request) {
  try {
    const { targetRoleId, years = 5 } = await request.json();

    if (!targetRoleId) {
      return NextResponse.json({ error: 'targetRoleId is required' }, { status: 400 });
    }

    const role = await prisma.jobRole.findUnique({
      where: { id: targetRoleId }
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // To simulate growth, we fetch the skills required by the role to get their average growth rate
    const roleSkills = await prisma.skill.findMany({
      where: {
        name: { in: role.required_skills }
      }
    });

    // Average growth rate of the skills needed for this role
    const avgGrowthRate = roleSkills.length > 0
      ? roleSkills.reduce((sum, skill) => sum + skill.growth_rate, 0) / roleSkills.length
      : 0.05; // Fallback 5% if no skills matched

    const simulation = [];
    let currentSalary = role.average_salary_lpa;

    for (let i = 1; i <= years; i++) {
        // Simple compound growth + some randomization for realism based on automation risk
        // High automation risk reduces growth potential
        const riskFactor = 1 - (role.automation_risk * 0.5); // e.g. 0.8 risk means 1 - 0.4 = 0.6 multiplier
        const effectiveGrowth = avgGrowthRate * riskFactor;
        
        currentSalary = currentSalary * (1 + effectiveGrowth);

        simulation.push({
            year: i,
            projected_salary: parseFloat(currentSalary.toFixed(2))
        });
    }

    return NextResponse.json({
        role: role.title,
        base_salary: role.average_salary_lpa,
        automation_risk: role.automation_risk,
        avg_skill_growth: avgGrowthRate,
        simulation 
    });
  } catch (error) {
    console.error('Error simulating career:', error);
    return NextResponse.json(
      { error: 'Failed to simulate career' },
      { status: 500 }
    );
  }
}
