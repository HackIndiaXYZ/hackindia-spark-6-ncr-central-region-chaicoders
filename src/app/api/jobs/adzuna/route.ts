import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { role, skills } = await req.json();
    if (!role) {
      return NextResponse.json({ error: "Missing role" }, { status: 400 });
    }

    const appKey = process.env.ADZUNA_APP_KEY;
    const appId  = process.env.ADZUNA_APP_ID;
    
    if (!appKey || !appId) {
      return NextResponse.json({ error: "API credentials missing" }, { status: 500 });
    }

    const encoded = encodeURIComponent(role);
    // Use 'in' end-point for job search in India. Adzuna handles different countries.
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${encoded}&content-type=application/json`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: "Adzuna fetch failed" }, { status: res.status });
    }
    
    const json = await res.json();
    const results = json.results || [];

    const userLower = (skills || []).map((s: string) => s.toLowerCase());

    const jobs = results.map((j: any) => {
      const descLow = (j.description || "").toLowerCase();
      let matchingSkillsCount = 0;
      const matchedSkills: string[] = [];
      
      userLower.forEach((s: string) => {
        if (descLow.includes(s) && !matchedSkills.includes(s)) {
          matchingSkillsCount++;
          matchedSkills.push(s);
        }
      });
      
      // Calculate chance based on Skill Vector logic
      let chance = 40;
      if (skills && skills.length > 0) {
        // Find how many of their skills match the job description
        const coverage = (matchingSkillsCount / Math.max(3, skills.length)) * 100;
        // Base probability plus matching plus a small variance
        chance = Math.min(99, Math.round(coverage * 0.8 + 25 + (Math.random() * 10)));
      } else {
        // Fallback chance if no skills defined
        chance = Math.floor(Math.random() * 30) + 20; 
      }

      // Fallback pool of common skills for this demo to compute missing skills
      const skillPool = ["AWS", "Docker", "Kubernetes", "React", "TypeScript", "Python", "SQL", "System Design", "CI/CD", "GraphQL", "Redis", "Kafka"];
      const missingSkills = skillPool.filter(s => (descLow.includes(s.toLowerCase()) && !matchedSkills.includes(s))).slice(0, 3);
      if (missingSkills.length === 0 && Math.random() > 0.5) {
         missingSkills.push(...skillPool.sort(() => 0.5 - Math.random()).slice(0, 2).filter(s => !matchedSkills.includes(s)));
      }

      const acceptanceRate = chance > 60 ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 5) + 1;
      const rejectionRate = 100 - acceptanceRate;

      return {
        id: j.id || Math.random().toString(),
        title: j.title || "Unknown Title",
        company: j.company?.display_name || "Confidential",
        location: j.location?.display_name || "Remote",
        description: j.description || "",
        salary_min: j.salary_min,
        salary_max: j.salary_max,
        url: j.redirect_url,
        matchPct: chance,
        matchedSkills,
        missingSkills,
        stats: {
          acceptanceRate,
          rejectionRate,
          applicants: Math.floor(Math.random() * 200) + 20
        }
      };
    });

    // Sort by best fit
    jobs.sort((a: any, b: any) => b.matchPct - a.matchPct);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Adzuna API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
