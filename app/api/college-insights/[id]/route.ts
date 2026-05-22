import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch the college
    const college = await prisma.college.findUnique({
      where: { id }
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Fetch placements deeply associated with companies
    const placements = await prisma.placement.findMany({
      where: { college_id: id },
      include: {
        company: true
      },
      orderBy: {
        avg_package: 'desc'
      }
    });

    // Aggregate statistics
    let totalPackage = 0;
    const categoryCount: Record<string, number> = {};
    const workloadCount: Record<string, number> = {};
    const frequencyCount: Record<string, number> = {};
    let allSkills: string[] = [];

    placements.forEach((p: any) => {
      totalPackage += p.avg_package;
      categoryCount[p.company.category] = (categoryCount[p.company.category] || 0) + 1;
      workloadCount[p.company.workload] = (workloadCount[p.company.workload] || 0) + 1;
      frequencyCount[p.company.frequency] = (frequencyCount[p.company.frequency] || 0) + 1;
      allSkills = allSkills.concat(p.top_skills);
    });

    const averagePackage = placements.length > 0 ? (totalPackage / placements.length).toFixed(1) : 0;
    
    // Count skill frequency to find top demanded techs
    const skillFrequency: Record<string, number> = {};
    allSkills.forEach(s => skillFrequency[s] = (skillFrequency[s] || 0) + 1);
    
    // Sort skills by demand
    const topDemandedSkills = Object.entries(skillFrequency)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      college,
      stats: {
        totalCompanies: placements.length,
        averagePackage: parseFloat(averagePackage.toString()),
        topPackage: placements.length > 0 ? placements[0].avg_package : 0,
        categoryBreakdown: categoryCount,
        frequencyBreakdown: frequencyCount,
        workloadBreakdown: workloadCount,
        topSkills: topDemandedSkills
      },
      placements: placements.map((p: any) => ({
        companyName: p.company.name,
        category: p.company.category,
        workload: p.company.workload,
        frequency: p.company.frequency,
        avgPackage: p.avg_package,
        requiredSkills: p.top_skills
      }))
    });

  } catch (error) {
    console.error('Error fetching college details:', error);
    return NextResponse.json({ error: 'Failed to fetch college details' }, { status: 500 });
  }
}
