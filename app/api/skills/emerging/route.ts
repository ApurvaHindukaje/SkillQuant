import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';
import { forecastSkillDemand } from '@/modules/core/lib/forecasting';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        trends: true // To get historical data
      }
    });

    // Calculate forecast for each skill based on historical trends
    const forecastedSkills = skills.map(skill => {
      const history = skill.trends.map(t => ({ year: t.year, demand_percentage: t.demand_percentage }));
      const predictedDemandNextYear = forecastSkillDemand(history);
      
      // Basic growth forecast representation: percentage change from last known year
      // Use the exact Scikit-Learn Machine Learning growth rate calculated in the Python data pipeline 
      // instead of recalculating an algebraic percentage here to ensure absolute parity with the Dashboard!
      // NOTE: We use future_growth_rate for the /forecast page to show the 2027 1-Year Prediction.
      const growthForecast = (skill as any).future_growth_rate * 100;

      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        currentDemand: skill.demand_score,
        predictedDemandNextYear,
        growthForecastPercentage: growthForecast
      };
    });

    // Sort by highest growth forecast
    forecastedSkills.sort((a, b) => b.growthForecastPercentage - a.growthForecastPercentage);

    return NextResponse.json({ data: forecastedSkills });
  } catch (error) {
    console.error('Error fetching emerging skills:', error);
    return NextResponse.json(
      { error: 'Failed to predict emerging skills' },
      { status: 500 }
    );
  }
}
