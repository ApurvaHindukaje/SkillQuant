import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function POST(request: Request) {
  try {
    const { userSkills } = await request.json();

    if (!userSkills || !Array.isArray(userSkills)) {
      return NextResponse.json({ error: 'userSkills array is required' }, { status: 400 });
    }

    const jobRoles = await prisma.jobRole.findMany();

    // Calculate match score and rank by it and salary
    const recommendations = jobRoles.map(role => {
      const matchCount = role.required_skills.filter(s => userSkills.includes(s)).length;
      const matchPercentage = (matchCount / role.required_skills.length) * 100;
      
      const score = matchPercentage * 0.6 + // 60% weight to skill match
                    (role.average_salary_lpa / 50) * 0.4; // 40% weight to salary (normalized roughly over 50 LPA max)

      return {
        ...role,
        matchPercentage,
        score
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5); // top 5 roles

    return NextResponse.json({ data: recommendations });
  } catch (error) {
    console.error('Error recommending career:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
