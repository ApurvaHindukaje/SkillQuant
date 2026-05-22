import { NextResponse } from 'next/server';
import prisma from '@/modules/core/lib/db';

export async function POST(request: Request) {
  try {
    const { userSkills, targetSalaryLPA } = await request.json();

    if (!userSkills || targetSalaryLPA == null) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fix case sensitivity block
    const lowerUserSkills = userSkills.map((s: string) => s.toLowerCase());

    const roles = await prisma.jobRole.findMany({
      orderBy: { average_salary_lpa: 'desc' }
    });

    let targetRoles = roles.filter(r => r.average_salary_lpa >= parseFloat(targetSalaryLPA));
    
    // Get categories of user skills to use as a fallback if exact skill match is 0
    const userSkillRecords = await prisma.skill.findMany({
       where: { OR: lowerUserSkills.map((s: string) => ({ name: { equals: s, mode: 'insensitive' } })) }
    });
    const userCategories = userSkillRecords.map(s => s.category);
    
    // Find the absolute best matching role globally, regardless of salary (to use as our base trajectory)
    let globalBestMatch = roles[0];
    let maxGlobalOverlap = -1;
    for (const role of roles) {
      const overlap = role.required_skills.filter(s => lowerUserSkills.includes(s.toLowerCase())).length;
      if (overlap > maxGlobalOverlap) {
        maxGlobalOverlap = overlap;
        globalBestMatch = role;
      }
    }
    
    // If overlap is 0, we fallback to category matching!
    if (maxGlobalOverlap === 0 && userCategories.length > 0) {
       // Find roles that require skills in the same category
       // Since JobRole doesn't have a direct category, we can guess based on title or we can just 
       // fetch the categories for the role's required skills. To save DB calls, we do a simple title check
       // or we just rely on the user's highest paying category match.
       const categoryMap: Record<string, string[]> = {
         'Backend': ['Backend', 'Developer', 'Engineer'],
         'Frontend': ['Frontend', 'Developer', 'UI'],
         'Data': ['Data', 'Analyst', 'Scientist'],
         'AI/ML': ['AI', 'Machine Learning', 'Data'],
         'Web3': ['Web3', 'Blockchain', 'Smart Contract'],
         'DevOps': ['DevOps', 'Cloud', 'Architect', 'Site Reliability'],
         'Cloud': ['Cloud', 'AWS', 'Azure', 'Architect'],
         'Security': ['Security', 'Cybersecurity', 'Analyst'],
         'Mobile': ['Mobile', 'iOS', 'Android', 'App']
       };
       
       let maxCategoryMatch = -1;
       for (const role of roles) {
          let catScore = 0;
          for (const cat of userCategories) {
             const keywords = categoryMap[cat] || [];
             if (keywords.some(k => role.title.toLowerCase().includes(k.toLowerCase()))) {
                 catScore++;
             }
          }
          if (catScore > maxCategoryMatch) {
             maxCategoryMatch = catScore;
             globalBestMatch = role;
          }
       }
    }
    
    let bestTargetRole;
    
    // Feature Extension: If target salary is way above the market base for their skills
    if (targetRoles.length === 0 || maxGlobalOverlap > 0) {
      // If they asked for a salary higher than any role OR if we found a good match path,
      // simulate a senior trajectory for their specific skillset!
      if (parseFloat(targetSalaryLPA) > globalBestMatch.average_salary_lpa) {
          bestTargetRole = {
            id: 'simulated-principal-role',
            title: `Principal / Staff ${globalBestMatch.title}`,
            average_salary_lpa: parseFloat(targetSalaryLPA),
            required_skills: Array.from(new Set([...globalBestMatch.required_skills, 'System Design', 'High-Level Architecture', 'Cloud Architecture', 'Team Leadership'])),
            automation_risk: globalBestMatch.automation_risk * 0.5 
          };
      } else {
          // If the salary is lower than the best match, just use the best match
          bestTargetRole = globalBestMatch;
      }
    } else {
      // Fallback if no skills match anything
      bestTargetRole = targetRoles[0];
    }

    // Identify Baseline Role
    // This is the role where the user meets the MOST requirements
    let baselineRole = roles[roles.length - 1]; // fallback to lowest
    let bestBaseOverlapRatio = -1;
    
    for (const role of roles) {
       if (role.average_salary_lpa >= bestTargetRole.average_salary_lpa && role.id !== bestTargetRole.id) continue;
       
       const overlap = role.required_skills.filter(s => lowerUserSkills.includes(s.toLowerCase())).length;
       const ratio = overlap / role.required_skills.length;
       
       if (ratio > bestBaseOverlapRatio) {
           bestBaseOverlapRatio = ratio;
           baselineRole = role;
       } else if (ratio === bestBaseOverlapRatio && role.average_salary_lpa > baselineRole.average_salary_lpa) {
           baselineRole = role;
       }
    }

    let baselineLPA = bestBaseOverlapRatio >= 0.5 ? baselineRole.average_salary_lpa : 4.5;
    if (baselineLPA >= bestTargetRole.average_salary_lpa) {
        baselineLPA = Math.max(3.0, bestTargetRole.average_salary_lpa - 2.0);
    }

    const missingSkills = bestTargetRole.required_skills.filter(s => !lowerUserSkills.includes(s.toLowerCase()));
    const targetLPA = bestTargetRole.average_salary_lpa;
    const salaryGap = targetLPA - baselineLPA;

    // Granular Steps: Create a milestone for roughly every 3-5 LPA gap
    // This guarantees the Gantt chart scales directly with the LPA selected
    let numSteps = Math.floor(salaryGap / 4);
    if (numSteps < 1) numSteps = 1;
    // Cap steps to the number of missing skills so we don't have empty milestones
    if (missingSkills.length > 0 && numSteps > missingSkills.length) numSteps = missingSkills.length;
    if (numSteps > 6) numSteps = 6; // Max 6 steps to avoid UI clutter

    // Distribute skills evenly across the steps
    // Since skills are usually ordered by basic -> advanced in DB, chunking them keeps a logical progression
    const skillChunks: string[][] = Array.from({ length: numSteps }, () => []);
    
    // We want the harder skills towards the end of the roadmap
    const sortedMissing = [...missingSkills];
    
    sortedMissing.forEach((skill, index) => {
        // Distribute round-robin or sequentially
        const chunkIndex = Math.floor((index / sortedMissing.length) * numSteps);
        skillChunks[Math.min(chunkIndex, numSteps - 1)].push(skill);
    });

    // Create Path Roles with interpolated salaries
    const pathRoles = [];
    
    // Prefix modifiers for intermediate roles to make them feel like a career ladder
    const prefixes = ["Associate", "Mid-Level", "Senior", "Lead", "Staff", "Principal", "Director"];
    const baseTitle = bestTargetRole.title.replace(/(Junior|Senior|Lead|Staff|Principal|Director)\s+/gi, '').trim();

    for (let i = 0; i < numSteps; i++) {
       const isLast = i === numSteps - 1;
       const stepSalary = isLast ? targetLPA : baselineLPA + ((salaryGap / numSteps) * (i + 1));
       
       let titleLabel = baseTitle;
       if (!isLast) {
           // Assign a progressive prefix
           const progressRatio = (i + 1) / (numSteps + 1);
           const prefixIdx = Math.floor(progressRatio * prefixes.length);
           titleLabel = `${prefixes[Math.min(prefixIdx, prefixes.length - 1)]} ${baseTitle}`;
       } else {
           titleLabel = bestTargetRole.title;
       }
       
       pathRoles.push({
           role: titleLabel,
           salaryLPA: Math.round(stepSalary * 10) / 10,
           skillsToLearnList: skillChunks[i]
       });
    }

    // Fetch metrics for all potentially missing skills to calculate hours
    const skillMetrics = await prisma.skill.findMany({
      where: { OR: missingSkills.map(s => ({ name: { equals: s, mode: 'insensitive' } })) }
    });

    // Generate milestones
    const milestones = [];
    
    // 1. Push the Baseline Milestone
    milestones.push({
        role: "Current Base Level",
        salaryLPA: Math.round(baselineLPA * 10) / 10,
        isBaseline: true,
        skillsToLearn: [],
        milestoneHours: 0,
        milestoneMonths: 0,
        startMonthOffset: 0
    });

    let totalOverallHours = 0;
    let globalMonthOffset = 0;

    // 2. Push all the Interpolated Progression Milestones
    for (let i = 0; i < pathRoles.length; i++) {
       const step = pathRoles[i];
       let milestoneHours = 0;
       const skillsToLearn = [];

       for (const s of step.skillsToLearnList) {
          const metric = skillMetrics.find(m => m.name.toLowerCase() === s.toLowerCase());
          let hours = 150.0; // Default fallback if not found
          if (metric) {
            // @ts-ignore - Prisma client typing might lag behind schema pushes
            hours = metric.complexity_hours !== undefined ? metric.complexity_hours : 150.0;
          }
          const monthsRequired = parseFloat((hours / 60).toFixed(1));
          
          skillsToLearn.push({ skill: s, hours, monthsRequired });
          milestoneHours += hours;
       }
       
       const milestoneMonths = parseFloat((milestoneHours / 60).toFixed(1));
       
       milestones.push({
          role: step.role,
          salaryLPA: step.salaryLPA,
          isBaseline: false,
          skillsToLearn,
          milestoneHours,
          milestoneMonths,
          startMonthOffset: globalMonthOffset
       });

       totalOverallHours += milestoneHours;
       globalMonthOffset += milestoneMonths;
    }

    const totalOverallMonths = parseFloat((totalOverallHours / 60).toFixed(1));

    return NextResponse.json({
      targetRole: bestTargetRole.title,
      actualSalary: targetLPA,
      totalHours: totalOverallHours,
      totalMonths: totalOverallMonths,
      milestones
    });

  } catch (error) {
    console.error('Time to Yield Error:', error);
    return NextResponse.json({ error: 'Failed to calculate yield time.' }, { status: 500 });
  }
}
