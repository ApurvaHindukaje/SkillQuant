import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

const ecosystemMap: Record<string, string[]> = {
  // Languages
  'python': ['django', 'flask', 'fastapi', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'airflow', 'data engineering'],
  'javascript': ['typescript', 'react', 'node.js', 'express', 'vue.js', 'next.js', 'svelte', 'react native'],
  'typescript': ['react', 'node.js', 'nestjs', 'next.js', 'graphql', 'express', 'svelte'],
  'java': ['spring boot', 'kafka', 'hadoop', 'spark', 'kotlin'],
  'c#': ['asp.net core', 'azure', 'sql'],
  'go': ['docker', 'kubernetes', 'grpc', 'terraform', 'prometheus'],
  'rust': ['webassembly', 'c++', 'linux', 'blockchain', 'solidity'],
  'php': ['laravel', 'mysql', 'javascript', 'vue.js', 'react'],
  'ruby': ['ruby on rails', 'postgresql', 'redis', 'javascript'],
  'c++': ['c', 'rust', 'assembly', 'opengl', 'unreal engine'],
  
  // Frontend
  'react': ['next.js', 'react native', 'typescript', 'graphql', 'tailwindcss'],
  'next.js': ['react', 'typescript', 'graphql', 'tailwindcss', 'node.js', 'vercel'],
  'angular': ['typescript', 'rxjs', 'java', 'spring boot'],
  'vue.js': ['nuxt.js', 'javascript', 'typescript', 'tailwindcss'],
  'svelte': ['javascript', 'typescript', 'tailwindcss'],
  
  // Backend & DB
  'node.js': ['express', 'nestjs', 'typescript', 'react', 'mongodb', 'postgresql', 'redis'],
  'django': ['python', 'postgresql', 'redis', 'react', 'celery'],
  'flask': ['python', 'postgresql', 'redis', 'react', 'docker'],
  'fastapi': ['python', 'pydantic', 'postgresql', 'docker', 'redis', 'sqlalchemy'],
  'spring boot': ['java', 'kotlin', 'postgresql', 'kafka', 'redis', 'docker'],
  'sql': ['postgresql', 'mysql', 'data engineering', 'snowflake', 'bigquery', 'tableau'],
  'postgresql': ['sql', 'redis', 'node.js', 'python', 'go', 'docker'],
  'mongodb': ['node.js', 'express', 'react', 'redis'],
  'redis': ['postgresql', 'node.js', 'python', 'go', 'docker', 'kafka'],
  'kafka': ['java', 'scala', 'go', 'data engineering', 'spark'],
  
  // DevOps / Cloud
  'docker': ['kubernetes', 'aws', 'gcp', 'terraform', 'jenkins', 'github actions', 'linux', 'go'],
  'kubernetes': ['docker', 'aws', 'gcp', 'azure', 'terraform', 'prometheus', 'grafana', 'go'],
  'aws': ['docker', 'kubernetes', 'terraform', 'python', 'node.js', 'dynamodb'],
  'azure': ['c#', 'asp.net core', 'docker', 'kubernetes', 'terraform', 'sql'],
  'gcp': ['kubernetes', 'docker', 'terraform', 'go', 'python', 'bigquery'],
  'terraform': ['aws', 'gcp', 'azure', 'kubernetes', 'docker', 'ansible', 'go'],
  
  // AI/ML
  'generative ai': ['python', 'pytorch', 'tensorflow', 'langchain', 'hugging face', 'openai api', 'mlops'],
  'mlops': ['kubernetes', 'docker', 'python', 'aws', 'gcp', 'tensorflow', 'pytorch', 'airflow'],
  'tensorflow': ['python', 'keras', 'opencv', 'generative ai', 'mlops'],
  'pytorch': ['python', 'generative ai', 'hugging face', 'mlops', 'opencv'],
  'scikit-learn': ['python', 'pandas', 'numpy', 'mlops'],
  'pandas': ['python', 'numpy', 'scikit-learn', 'sql', 'data engineering'],
  
  // Mobile
  'react native': ['react', 'typescript', 'javascript', 'ios', 'android'],
  'flutter': ['dart', 'firebase', 'ios', 'android', 'sqlite'],
  'swift': ['ios', 'objective-c', 'firebase', 'apple', 'c++'],
  'kotlin': ['java', 'android', 'spring boot', 'jetpack compose'],
  
  // Web3
  'solidity': ['web3.js', 'ethers.js', 'smart contracts', 'blockchain', 'rust'],
  'blockchain': ['solidity', 'rust', 'go', 'smart contracts', 'cryptography']
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rootSkill = searchParams.get('skill');

  if (!rootSkill) {
    return NextResponse.json({ error: 'Root skill parameter is required' }, { status: 400 });
  }

  try {
    // 1. Find the root skill
    const source = await prisma.skill.findFirst({
      where: { name: { equals: rootSkill, mode: 'insensitive' } }
    });

    if (!source) {
      return NextResponse.json({ error: 'Skill not found in database' }, { status: 404 });
    }

    // Identify related ecosystem tech via map or fallback to exact category match
    const relatedTechNames = ecosystemMap[source.name.toLowerCase()] || [];

    // 2. Fetch all other skills sorted by index to pluck the best paths
    // Filter out completely dead skills immediately
    const candidates = await prisma.skill.findMany({
      where: {
        id: { not: source.id },
        growth_rate: { gt: 0.005 }, // Must have at least a tiny bit of positive growth
        skill_price_index: { gt: 0.1 }
      },
      orderBy: [
        { skill_price_index: 'desc' }
      ]
    });

    // Deep Specialization: skills heavily related to current node mathematically or logically
    let directPath = candidates.filter(c => relatedTechNames.includes(c.name.toLowerCase()));
    
    // Fallback if ecosystem map missed it
    if (directPath.length < 3) {
      const categoryFallback = candidates.filter(c => 
         c.category === source.category && 
         !directPath.find(d => d.id === c.id) &&
         (c.salary_average_lpa > source.salary_average_lpa || c.growth_rate > source.growth_rate)
      );
      directPath = [...directPath, ...categoryFallback];
    }
    
    // Sort explicitly to get highest SPI and Growth First
    directPath.sort((a, b) => b.skill_price_index - a.skill_price_index || b.growth_rate - a.growth_rate);
    directPath = directPath.slice(0, 3);
        
    // Strategic Pivot: Top booming technologies in completely DIFFERENT categories representing a career switch
    let pivotPath = candidates
        .filter(c => c.category !== source.category && !relatedTechNames.includes(c.name.toLowerCase()))
        .filter(c => c.salary_average_lpa > source.salary_average_lpa || c.growth_rate > source.growth_rate);
    
    pivotPath.sort((a, b) => b.skill_price_index - a.skill_price_index || b.growth_rate - a.growth_rate);
    pivotPath = pivotPath.slice(0, 3);

    return NextResponse.json({
      root: source,
      paths: {
        specialization: directPath,
        pivot: pivotPath
      }
    });

  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}
