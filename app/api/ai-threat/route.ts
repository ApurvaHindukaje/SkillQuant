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

    // 1. Calculate base AI replacement risk per skill based on category complexity
    let totalRisk = 0;

    const analyzedSkills = skills.map(s => {
      const cat = s.category.toLowerCase();
      
      // High Risk: Predictable syntax, boilerplate-heavy, well-documented
      // Medium Risk: Requires some architectural assembly
      // Low Risk: Hardware/physical layer, abstract math, novel deep-tech
      let baseRiskPercentage = 50;

      if (cat.includes('frontend') || cat.includes('html') || cat.includes('css')) {
        baseRiskPercentage = 85; 
      } else if (cat.includes('scripting') || cat.includes('php') || cat.includes('ruby')) {
        baseRiskPercentage = 75;
      } else if (cat.includes('javascript') || cat.includes('web')) {
        baseRiskPercentage = 70;
      } else if (cat.includes('backend') || cat.includes('mobile')) {
        baseRiskPercentage = 55;
      } else if (cat.includes('database') || cat.includes('sql')) {
        baseRiskPercentage = 45;
      } else if (cat.includes('devops') || cat.includes('cloud') || cat.includes('docker')) {
        baseRiskPercentage = 30;
      } else if (cat.includes('data eng') || cat.includes('system') || cat.includes('rust') || cat.includes('c++')) {
        baseRiskPercentage = 15;
      } else if (cat.includes('ai') || cat.includes('machine learning') || cat.includes('blockchain')) {
        baseRiskPercentage = 5; // Creating the AI is currently low replacement risk
      }

      // Nuance: Highly saturated skills are more likely to have training loops 
      // built against them by LLMs.
      const saturationPenalty = (s.saturation_level / 100) * 15;
      baseRiskPercentage += saturationPenalty;

      const finalRisk = Math.min(Math.max(baseRiskPercentage, 1), 99);
      totalRisk += finalRisk;

      return {
        name: s.name,
        category: s.category,
        aiRiskScore: finalRisk.toFixed(1),
        isImmune: finalRisk < 35
      };
    });

    // 2. Aggregate Risk Profile
    const overallRisk = totalRisk / skills.length;
    
    // 3. Generate 10-Year Survival Curve Data
    // We'll decay their market value based on the risk score
    const currentYear = new Date().getFullYear();
    const survivalCurve = [];
    
    let currentMarketUtility = 100; // 100% utility today

    for (let i = 0; i <= 10; i++) {
       survivalCurve.push({
          year: currentYear + i,
          utility: currentMarketUtility.toFixed(1)
       });

       // Decay math: High risk means faster drop off. 
       // If risk is 80%, you lose 8% utility per year compounding.
       const annualDecayFactor = (overallRisk / 100) / 10; 
       currentMarketUtility = currentMarketUtility * (1 - annualDecayFactor);
    }

    return NextResponse.json({
      overallRiskScore: overallRisk.toFixed(1),
      analyzedSkills: analyzedSkills.sort((a,b) => parseFloat(b.aiRiskScore) - parseFloat(a.aiRiskScore)),
      survivalCurve
    });

  } catch (error) {
    console.error('AI Threat Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to simulate AI obsolescence.' }, { status: 500 });
  }
}
