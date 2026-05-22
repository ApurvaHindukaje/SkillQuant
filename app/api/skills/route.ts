import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = category ? { category } : {};

    const skills = await prisma.skill.findMany({
      where,
      take: limit,
      orderBy: {
        demand_score: 'desc'
      }
    });

    return NextResponse.json({ data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
