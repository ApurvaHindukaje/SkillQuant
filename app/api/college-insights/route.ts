import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}
