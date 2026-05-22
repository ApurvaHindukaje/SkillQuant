import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');

    const where = skillId ? { skill_id: skillId } : {};

    const trends = await prisma.skillTrend.findMany({
      where,
      orderBy: [
        { skill_id: 'asc' },
        { year: 'asc' }
      ]
    });

    return NextResponse.json({ data: trends });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
