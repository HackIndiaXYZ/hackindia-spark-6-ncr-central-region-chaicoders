import { chatWithMarketLLM } from "./llm";

export interface MarketData {
  skills: string[];
  demand: "High" | "Medium" | "Low";
  salary: { min: number; max: number; currency: string };
  trends: string[];
}

/**
 * Fetches real job listings from JSearch (RapidAPI)
 */
async function fetchJSearchData(role: string) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(role)}&num_pages=1&date_posted=all`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error(`JSearch error ${response.status}`);
    const data = await response.json();
    return data.data; // Array of job objects
  } catch (error) {
    console.error("JSearch fetch failed:", error);
    return null;
  }
}

/**
 * Fetches high-frequency job listings from Active Jobs DB (RapidAPI)
 */
async function fetchActiveJobsData(role: string) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://active-jobs-db.p.rapidapi.com/active-ats-1h?offset=0&title_filter=${encodeURIComponent(`"${role}"`)}&description_type=text`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "active-jobs-db.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error(`Active Jobs DB error ${response.status}`);
    const data = await response.json();
    return data; // Array of job objects
  } catch (error) {
    console.error("Active Jobs DB fetch failed:", error);
    return null;
  }
}

/**
 * Career Intelligence System - Real-time Market Intelligence Fetcher
 * 
 * Combines multi-source real-world job data (JSearch & Active Jobs DB) 
 * with AI analysis to produce accurate professional benchmarks.
 */
export async function fetchLiveMarketData(role: string): Promise<MarketData> {
  // Fetch from multiple sources in parallel
  const [jSearchJobs, activeJobs] = await Promise.all([
    fetchJSearchData(role),
    fetchActiveJobsData(role)
  ]);
  
  const allJobs = [
    ...(jSearchJobs || []).map((j: any) => ({
      title: j.job_title,
      description: j.job_description,
      min_salary: j.job_min_salary,
      max_salary: j.job_max_salary,
      source: "JSearch"
    })),
    ...(activeJobs || []).map((j: any) => ({
      title: j.job_title,
      description: j.job_description,
      min_salary: j.salary_min,
      max_salary: j.salary_max,
      source: "ActiveJobsDB"
    }))
  ];

  const hasRealData = allJobs.length > 0;
  
  const prompt = hasRealData 
    ? `Analyze these ${allJobs.length} REAL job listings from multiple sources (JSearch & Active Jobs DB) for "${role}".
       EXTRACT the consensus market standard skills, demand, and salary.
       
       JOB DATA SUMMARY: ${JSON.stringify(allJobs.slice(0, 10).map(j => ({
         title: j.title,
         description: j.description?.substring(0, 300) + "...",
         salary: `${j.min_salary} - ${j.max_salary}`
       })))}`
    : `Synthesize the CURRENT global market standards (2026) for the role: "${role}".`;

  const finalPrompt = `
    ${prompt}
    
    Provide the response strictly as a JSON object with:
    - "skills": (array of 8-10 specific technical skills consistently appearing across these listings)
    - "demand": (string: "High", "Medium", or "Low")
    - "salary": { "min": number, "max": number, "currency": "USD" }
    - "trends": (array of 3 current industry trends detected in these job posts)
    
    Respond with ONLY the JSON object.
  `;

  try {
    const rawResponse = await chatWithMarketLLM([
      { role: "system", content: "You are a data-only market analyst specializing in multi-source career intelligence." },
      { role: "user", content: finalPrompt }
    ]);

    const jsonStr = rawResponse.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr) as MarketData;
  } catch (error) {
    console.error("Failed to fetch live market data:", error);
    return {
      skills: ["React", "TypeScript", "Node.js", "SQL", "Git", "Cloud Architecture"],
      demand: "High",
      salary: { min: 90000, max: 160000, currency: "USD" },
      trends: ["AI-Assisted Development", "Serverless Architecture", "Edge Computing"]
    };
  }
}
