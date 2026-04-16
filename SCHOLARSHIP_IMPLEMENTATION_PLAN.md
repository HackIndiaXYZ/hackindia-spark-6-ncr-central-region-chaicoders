# 🎓 Scholarship Discovery & Matching Implementation Plan

This document outlines the strategy for integrating a smart scholarship discovery system into the **Career Intelligence System**, leveraging resume data and LLM-powered matching.

## 1. Data Layer: Enhanced Profile Extraction
To match scholarships accurately, we need more specific data than what is currently captured.

### Current Extracted Data
- Name
- Institution
- Career Goal
- Education Level
- Skills

### Required Additional Data
- **Major / Field of Study**: (e.g., Computer Science, Mechanical Engineering)
- **GPA**: (e.g., 3.8/4.0)
- **Nationality / Residence**: (Crucial for eligibility)
- **Diversity Identifiers**: (Gender, Ethnicity - for specific demographic grants)
- **Research Interests**: (For academic/PhD scholarships)

> [!NOTE]
> We will update `src/app/api/parse-resume/route.ts` to include these fields in the LLM extraction prompt.

---

## 2. Discovery Engine: Sourcing Scholarships
Since there is no single global scholarship API, we will use a multi-pronged approach:

### Phase A: Automated Search (SerpApi)
We will generate targeted search queries using the user's profile:
- `SerpApi` (Google Search) query: `"Scholarships for [Nationality] students in [Major] [Year]"`
- `SerpApi` (Google Scholar) query: `"Research grants for [Research Interest] [Degree Level]"`

### Phase B: Curated Database
Integrate a database of high-value, evergreen scholarships (e.g., Rhodes, Fulbright, Google PhD Fellowship, TATA Trusts) to ensure high-quality "Anchor" results.

---

## 3. Intelligence Layer: Semantic Matching & Ranking
Once we have a list of potential scholarships, the system will rank them:

1. **Hard Filtering (Boolean Logic)**:
   - Exclude scholarships where the user doesn't meet the nationality or degree level requirement.
   - Example: `If (User.Nationality != 'US') && (Scholarship.Target == 'US Citizens Only') => Exclude`

2. **Vector Alignment (RAG)**:
   - Convert the **User Resume** and **Scholarship Description** into embeddings.
   - Calculate cosine similarity to find topical matches.

3. **LLM Scoring (Deep Analysis)**:
   - Ask the LLM: *"Score this scholarship fit from 0-100 based on the user's career goal: [Goal] and projects: [Projects]. Provide 3 reasons why."*
   - Return a `matchScore` and `reasoning`.

---

## 4. UI/UX: The "Scholarship Hub"
Integrate a new section in the Dashboard to display these opportunities.

| Feature | Description |
|---|---|
| **Fit Score** | A percentage (e.g., 95%) showing how well the user qualifies. |
| **Eligibility Alerts** | Warning if a GPA is close but slightly below the requirement. |
| **Deadline Tracker** | Visual countdown to application closing dates. |
| **AI Assistant** | "Draft my Statement of Purpose for this scholarship" feature. |

---

## 5. Next Steps (Development Roadmap)
1. [ ] **Update Schema**: Add `gpa`, `major`, `nationality` to the `users` table in Supabase.
2. [ ] **Update Resume Parser**: Modify the Prompt in `/api/parse-resume` to extract the new fields.
3. [ ] **Build `api/scholarships` Route**: Implement the search and ranking logic using SerpApi and OpenAI/NVIDIA.
4. [ ] **Dashboard Integration**: Add a "Scholarships" tab and UI cards.
