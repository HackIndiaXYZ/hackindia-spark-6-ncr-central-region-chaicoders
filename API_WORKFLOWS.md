# 🔄 API Interaction & Data Workflow

This document explains **why** each API is called, exactly what **input data** is sent, and what **output data** is returned to the Career Intelligence System.

---

## 1. 🧠 AI Career Engine (e.g., OpenAI / Anthropic)
**Why used:** To provide personalized career guidance, analyze resumes, and generate industry-specific roadmaps.

| Feature | Input Data (Request) | Output Data (Response) |
|---|---|---|
| **Resume Analysis** | Raw PDF text, current job goals, and skill tags. | Score (1-100), missing keywords, and formatting suggestions. |
| **Roadmap Generation** | Target role (e.g., "AI Engineer"), current skills, and location. | Step-by-step 12-month timeline, recommended certifications, and local market demand. |
| **Career Chat** | User's message history and professional profile metadata. | Natural language responses with actionable advice and relevant links. |

---

## 2. 💼 Real-Time Job Tracking (e.g., Adzuna / LinkedIn)
**Why used:** To populate the dashboard with active, relevant job listings matched to the user's profile.

| Feature | Input Data (Request) | Output Data (Response) |
|---|---|---|
| **Job Search** | Keywords, location radius, minimum salary, and contract type. | List of job objects: title, company, salary range, source URL, and date posted. |
| **Market Stats** | Job category and region. | Average salary data, historical demand trends, and competitive score (applicants per job). |

---

## 3. 🔐 User Identity & Data (Supabase)
**Why used:** To securely manage user sessions, store profiles, and persist their career progress.

| Feature | Input Data (Request) | Output Data (Response) |
|---|---|---|
| **Authentication** | User email/password OR OAuth transition token (Google/GitHub). | Session JWT, User ID (UUID), and basic profile metadata. |
| **Profile Storage**| User ID + JSON object (education, experience, saved jobs). | Success/Failure status and the updated profile object. |
| **DB Queries** | Filters (e.g., "get all saved jobs for user X"). | Array of rows from the database (PostgreSQL). |

---

## 4. 💌 Communication System (e.g., Resend / Postmark)
**Why used:** To keep users engaged via email alerts for new jobs or deadline reminders.

| Feature | Input Data (Request) | Output Data (Response) |
|---|---|---|
| **Career Alerts** | Recipient email, dynamic job data, and user's saved preferences. | Delivery status/ID and timestamp tracking. |
| **Magic Links** | User email and a temporary authentication secret. | Transactional email sent to the user's inbox. |
46: 
47: ---
48: 
49: ## 5. 🔍 Cold Outreach & Prospecting (e.g., Hunter.io / Apollo)
50: **Why used:** To automate the process of finding recruiter contact details and sending personalized outreach emails.
51: 
52: | Feature | Input Data (Request) | Output Data (Response) |
53: |---|---|---|
54: | **Email Finder** | Domain name (e.g., "google.com") or Recruiter Name + Company. | Verified email address and confidence score. |
55: | **Outreach** | Personalized email template, recipient address, and scheduling data. | Log of sent emails, opens, and clicks. |
56: 
57: ---
58: 
59: ## 6. 🗺️ Global Roadmap Intelligence (Custom or 3rd Party)
**Why used:** To map local skills to global standards (e.g., "Is a degree from India valid for this US role?").

| Feature | Input Data (Request) | Output Data (Response) |
|---|---|---|
| **Credential Mapping**| Degree title, University name, and Target country. | Equivalence score and additional requirements (e.g., WES evaluation needs). |
| **Visa Guidance** | Current citizenship and target job location. | Basic visa types available for that profession and eligibility checklists. |

---

## 🛠️ Data Flow Summary (Visual)

```mermaid
graph TD
    A[User Action] --> B{API Gateway}
    B -->|Resume Data| C[OpenAI API]
    C -->|Analysis Output| D[Dashboard UI]
    B -->|Search Query| E[Adzuna/Job API]
    E -->|Job List| D
    B -->|Auth Request| F[Supabase]
    F -->|User Session| D
    B -->|Send Alert| G[Resend API]
71:     G -->|Email| H[User Inbox]
72:     B -->|Find Recruiter| I[Hunter/Apollo API]
73:     I -->|Recruiter Info| D
74: ```
