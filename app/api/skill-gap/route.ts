import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function POST(request: Request) {
  try {
    const { userSkills, targetRoleId } = await request.json();

    if (!userSkills || !targetRoleId) {
      return NextResponse.json({ error: 'userSkills array and targetRoleId are required' }, { status: 400 });
    }

    const role = await prisma.jobRole.findUnique({
      where: { id: targetRoleId }
    });

    if (!role) {
      return NextResponse.json({ error: 'Target role not found' }, { status: 404 });
    }

    const required = role.required_skills;
    const missingSkillsIds = required.filter(skill => !userSkills.includes(skill));

    // Fetch details for the missing skills
    const missingSkillsData = await prisma.skill.findMany({
      where: {
        name: { in: missingSkillsIds }
      },
      orderBy: {
        demand_score: 'desc' // highest demand missing skills first
      }
    });

    return NextResponse.json({
        targetRole: role.title,
        missingSkills: missingSkillsData
    });
  } catch (error) {
    console.error('Error calculating skill gap:', error);
    return NextResponse.json(
      { error: 'Failed to calculate skill gap' },
      { status: 500 }
    );
  }
}
