/**
 * Career Intelligence System — Canonical Skill Taxonomy
 *
 * 300+ skills organized by category. Each entry has a canonical name and
 * a list of aliases (lowercased) used for fuzzy text matching against
 * raw job descriptions.
 *
 * Used by: skill-extractor.ts
 */

export interface SkillEntry {
  canonical: string;
  category: SkillCategory;
  aliases: string[];
}

export type SkillCategory =
  | "language"
  | "framework"
  | "database"
  | "cloud"
  | "devops"
  | "ai_ml"
  | "data"
  | "security"
  | "soft_skill"
  | "platform"
  | "methodology"
  | "tool";

export const SKILL_TAXONOMY: SkillEntry[] = [
  // ─── Languages ───────────────────────────────────────────────────────────────
  { canonical: "Python",       category: "language",  aliases: ["python", "python3", "python 3", "py"] },
  { canonical: "JavaScript",   category: "language",  aliases: ["javascript", "js", "ecmascript", "es6", "es2015", "vanilla js"] },
  { canonical: "TypeScript",   category: "language",  aliases: ["typescript", "ts"] },
  { canonical: "Java",         category: "language",  aliases: ["java", "jvm", "java 8", "java 11", "java 17"] },
  { canonical: "Go",           category: "language",  aliases: ["golang", "go lang", "go-lang"] },
  { canonical: "Rust",         category: "language",  aliases: ["rust", "rust-lang"] },
  { canonical: "C++",          category: "language",  aliases: ["c++", "cpp", "c plus plus"] },
  { canonical: "C#",           category: "language",  aliases: ["c#", "csharp", "c sharp", ".net", "dotnet"] },
  { canonical: "C",            category: "language",  aliases: [" c ", "c language", "c programming"] },
  { canonical: "Ruby",         category: "language",  aliases: ["ruby", "rb"] },
  { canonical: "PHP",          category: "language",  aliases: ["php"] },
  { canonical: "Swift",        category: "language",  aliases: ["swift", "swiftui"] },
  { canonical: "Kotlin",       category: "language",  aliases: ["kotlin"] },
  { canonical: "Scala",        category: "language",  aliases: ["scala", "akka"] },
  { canonical: "R",            category: "language",  aliases: ["rlang", "r language", "r programming"] },
  { canonical: "MATLAB",       category: "language",  aliases: ["matlab"] },
  { canonical: "Bash",         category: "language",  aliases: ["bash", "shell", "shell scripting", "bash scripting"] },
  { canonical: "Perl",         category: "language",  aliases: ["perl"] },
  { canonical: "Haskell",      category: "language",  aliases: ["haskell"] },
  { canonical: "Elixir",       category: "language",  aliases: ["elixir", "phoenix"] },
  { canonical: "Dart",         category: "language",  aliases: ["dart"] },
  { canonical: "Lua",          category: "language",  aliases: ["lua"] },
  { canonical: "Solidity",     category: "language",  aliases: ["solidity", "smart contracts"] },

  // ─── Frontend Frameworks ─────────────────────────────────────────────────────
  { canonical: "React",        category: "framework", aliases: ["react", "reactjs", "react.js", "react js"] },
  { canonical: "Next.js",      category: "framework", aliases: ["next.js", "nextjs", "next js"] },
  { canonical: "Vue.js",       category: "framework", aliases: ["vue", "vuejs", "vue.js", "vue js"] },
  { canonical: "Angular",      category: "framework", aliases: ["angular", "angularjs", "angular.js"] },
  { canonical: "Svelte",       category: "framework", aliases: ["svelte", "sveltekit"] },
  { canonical: "Nuxt.js",      category: "framework", aliases: ["nuxt", "nuxtjs", "nuxt.js"] },
  { canonical: "Remix",        category: "framework", aliases: ["remix"] },
  { canonical: "Gatsby",       category: "framework", aliases: ["gatsby", "gatsbyjs"] },

  // ─── Backend Frameworks ──────────────────────────────────────────────────────
  { canonical: "Node.js",      category: "framework", aliases: ["node", "nodejs", "node.js"] },
  { canonical: "Express.js",   category: "framework", aliases: ["express", "expressjs", "express.js"] },
  { canonical: "Fastify",      category: "framework", aliases: ["fastify"] },
  { canonical: "NestJS",       category: "framework", aliases: ["nestjs", "nest.js"] },
  { canonical: "Django",       category: "framework", aliases: ["django"] },
  { canonical: "FastAPI",      category: "framework", aliases: ["fastapi", "fast api"] },
  { canonical: "Flask",        category: "framework", aliases: ["flask"] },
  { canonical: "Spring Boot",  category: "framework", aliases: ["spring boot", "spring", "springboot"] },
  { canonical: "Rails",        category: "framework", aliases: ["ruby on rails", "rails", "ror"] },
  { canonical: "Laravel",      category: "framework", aliases: ["laravel"] },
  { canonical: "ASP.NET",      category: "framework", aliases: ["asp.net", "aspnet", "asp net"] },
  { canonical: "Gin",          category: "framework", aliases: ["gin", "gin-gonic"] },
  { canonical: "Fiber",        category: "framework", aliases: ["fiber"] },
  { canonical: "gRPC",         category: "framework", aliases: ["grpc", "g rpc", "protocol buffers", "protobuf"] },
  { canonical: "GraphQL",      category: "framework", aliases: ["graphql", "graph ql", "hasura"] },
  { canonical: "REST APIs",    category: "framework", aliases: ["rest api", "restful", "rest", "restful api"] },

  // ─── Mobile ──────────────────────────────────────────────────────────────────
  { canonical: "React Native",  category: "framework", aliases: ["react native", "react-native"] },
  { canonical: "Flutter",       category: "framework", aliases: ["flutter"] },
  { canonical: "iOS",           category: "platform",  aliases: ["ios development", "xcode"] },
  { canonical: "Android",       category: "platform",  aliases: ["android development", "android sdk"] },

  // ─── Databases ───────────────────────────────────────────────────────────────
  { canonical: "PostgreSQL",    category: "database",  aliases: ["postgresql", "postgres", "pg", "psql"] },
  { canonical: "MySQL",         category: "database",  aliases: ["mysql"] },
  { canonical: "MongoDB",       category: "database",  aliases: ["mongodb", "mongo"] },
  { canonical: "Redis",         category: "database",  aliases: ["redis"] },
  { canonical: "Elasticsearch", category: "database",  aliases: ["elasticsearch", "elastic search", "opensearch"] },
  { canonical: "Cassandra",     category: "database",  aliases: ["cassandra", "apache cassandra"] },
  { canonical: "DynamoDB",      category: "database",  aliases: ["dynamodb", "dynamo db"] },
  { canonical: "SQLite",        category: "database",  aliases: ["sqlite"] },
  { canonical: "SQL Server",    category: "database",  aliases: ["sql server", "mssql", "microsoft sql"] },
  { canonical: "Oracle DB",     category: "database",  aliases: ["oracle", "oracle db", "oracle database"] },
  { canonical: "Supabase",      category: "database",  aliases: ["supabase"] },
  { canonical: "Firebase",      category: "database",  aliases: ["firebase", "firestore", "firebase realtime"] },
  { canonical: "CockroachDB",   category: "database",  aliases: ["cockroachdb", "cockroach"] },
  { canonical: "Neo4j",         category: "database",  aliases: ["neo4j", "graph database"] },
  { canonical: "Pinecone",      category: "database",  aliases: ["pinecone", "vector database", "vector db", "qdrant", "weaviate", "chromadb"] },

  // ─── Cloud Platforms ─────────────────────────────────────────────────────────
  { canonical: "AWS",           category: "cloud",  aliases: ["aws", "amazon web services", "amazon cloud"] },
  { canonical: "GCP",           category: "cloud",  aliases: ["gcp", "google cloud", "google cloud platform"] },
  { canonical: "Azure",         category: "cloud",  aliases: ["azure", "microsoft azure"] },
  { canonical: "Vercel",        category: "cloud",  aliases: ["vercel"] },
  { canonical: "Netlify",       category: "cloud",  aliases: ["netlify"] },
  { canonical: "Heroku",        category: "cloud",  aliases: ["heroku"] },
  { canonical: "Cloudflare",    category: "cloud",  aliases: ["cloudflare", "cloudflare workers"] },
  { canonical: "DigitalOcean",  category: "cloud",  aliases: ["digitalocean", "digital ocean"] },

  // ─── AWS Services ────────────────────────────────────────────────────────────
  { canonical: "Lambda",        category: "cloud",  aliases: ["aws lambda", "lambda", "serverless functions"] },
  { canonical: "S3",            category: "cloud",  aliases: ["s3", "aws s3", "amazon s3"] },
  { canonical: "EC2",           category: "cloud",  aliases: ["ec2", "aws ec2"] },
  { canonical: "ECS",           category: "cloud",  aliases: ["ecs", "aws ecs", "fargate"] },
  { canonical: "EKS",           category: "cloud",  aliases: ["eks", "aws eks"] },
  { canonical: "RDS",           category: "cloud",  aliases: ["rds", "aws rds"] },
  { canonical: "CloudFront",    category: "cloud",  aliases: ["cloudfront", "cdn"] },
  { canonical: "SQS",           category: "cloud",  aliases: ["sqs", "aws sqs"] },
  { canonical: "SNS",           category: "cloud",  aliases: ["sns", "aws sns"] },
  { canonical: "API Gateway",   category: "cloud",  aliases: ["api gateway", "aws api gateway"] },

  // ─── DevOps & Infrastructure ─────────────────────────────────────────────────
  { canonical: "Docker",        category: "devops", aliases: ["docker", "containerization", "containers", "dockerfile"] },
  { canonical: "Kubernetes",    category: "devops", aliases: ["kubernetes", "k8s", "kube", "kubectl", "helm"] },
  { canonical: "Terraform",     category: "devops", aliases: ["terraform", "iac", "infrastructure as code"] },
  { canonical: "Ansible",       category: "devops", aliases: ["ansible"] },
  { canonical: "CI/CD",         category: "devops", aliases: ["ci/cd", "ci cd", "continuous integration", "continuous deployment", "continuous delivery"] },
  { canonical: "GitHub Actions",category: "devops", aliases: ["github actions", "gh actions"] },
  { canonical: "Jenkins",       category: "devops", aliases: ["jenkins"] },
  { canonical: "GitLab CI",     category: "devops", aliases: ["gitlab ci", "gitlab", "gitlab-ci"] },
  { canonical: "ArgoCD",        category: "devops", aliases: ["argocd", "argo cd"] },
  { canonical: "Prometheus",    category: "devops", aliases: ["prometheus"] },
  { canonical: "Grafana",       category: "devops", aliases: ["grafana"] },
  { canonical: "Datadog",       category: "devops", aliases: ["datadog"] },
  { canonical: "Nginx",         category: "devops", aliases: ["nginx"] },
  { canonical: "Linux",         category: "devops", aliases: ["linux", "unix", "ubuntu", "centos", "debian"] },
  { canonical: "Git",           category: "tool",   aliases: ["git", "version control", "source control"] },

  // ─── AI & Machine Learning ───────────────────────────────────────────────────
  { canonical: "Machine Learning",  category: "ai_ml", aliases: ["machine learning", "ml", "ml engineer", "ml engineering"] },
  { canonical: "Deep Learning",     category: "ai_ml", aliases: ["deep learning", "dl", "neural networks", "neural network"] },
  { canonical: "LLMs",              category: "ai_ml", aliases: ["llm", "large language model", "llms", "gpt", "openai api", "language models"] },
  { canonical: "Computer Vision",   category: "ai_ml", aliases: ["computer vision", "cv", "image recognition", "object detection"] },
  { canonical: "NLP",               category: "ai_ml", aliases: ["nlp", "natural language processing", "text processing"] },
  { canonical: "TensorFlow",        category: "ai_ml", aliases: ["tensorflow", "tf"] },
  { canonical: "PyTorch",           category: "ai_ml", aliases: ["pytorch", "torch"] },
  { canonical: "Scikit-learn",      category: "ai_ml", aliases: ["scikit-learn", "sklearn", "scikit learn"] },
  { canonical: "Hugging Face",      category: "ai_ml", aliases: ["hugging face", "huggingface", "transformers"] },
  { canonical: "LangChain",         category: "ai_ml", aliases: ["langchain", "lang chain"] },
  { canonical: "RAG",               category: "ai_ml", aliases: ["rag", "retrieval augmented generation", "retrieval-augmented"] },
  { canonical: "MLOps",             category: "ai_ml", aliases: ["mlops", "ml ops", "model deployment", "model serving"] },
  { canonical: "Reinforcement Learning", category: "ai_ml", aliases: ["reinforcement learning", "rl", "rlhf"] },
  { canonical: "Generative AI",     category: "ai_ml", aliases: ["generative ai", "gen ai", "genai", "ai generated"] },
  { canonical: "OpenAI",            category: "ai_ml", aliases: ["openai", "chatgpt api", "gpt-4", "gpt4"] },

  // ─── Data Engineering ────────────────────────────────────────────────────────
  { canonical: "SQL",              category: "data",  aliases: ["sql", "structured query language", "query language"] },
  { canonical: "Apache Spark",     category: "data",  aliases: ["apache spark", "spark", "pyspark"] },
  { canonical: "Apache Kafka",     category: "data",  aliases: ["kafka", "apache kafka", "event streaming"] },
  { canonical: "Airflow",          category: "data",  aliases: ["airflow", "apache airflow"] },
  { canonical: "dbt",              category: "data",  aliases: ["dbt", "data build tool"] },
  { canonical: "Snowflake",        category: "data",  aliases: ["snowflake"] },
  { canonical: "BigQuery",         category: "data",  aliases: ["bigquery", "big query", "google bigquery"] },
  { canonical: "Redshift",         category: "data",  aliases: ["redshift", "amazon redshift", "aws redshift"] },
  { canonical: "Data Warehousing", category: "data",  aliases: ["data warehouse", "data warehousing", "etl", "elt"] },
  { canonical: "Tableau",          category: "data",  aliases: ["tableau"] },
  { canonical: "Power BI",         category: "data",  aliases: ["power bi", "powerbi"] },
  { canonical: "Pandas",           category: "data",  aliases: ["pandas"] },
  { canonical: "NumPy",            category: "data",  aliases: ["numpy"] },
  { canonical: "Data Pipelines",   category: "data",  aliases: ["data pipeline", "data pipelines", "etl pipeline"] },
  { canonical: "Delta Lake",       category: "data",  aliases: ["delta lake", "delta", "databricks"] },
  { canonical: "Databricks",       category: "data",  aliases: ["databricks"] },

  // ─── Security ────────────────────────────────────────────────────────────────
  { canonical: "Cybersecurity",    category: "security", aliases: ["cybersecurity", "information security", "infosec"] },
  { canonical: "Penetration Testing", category: "security", aliases: ["penetration testing", "pentesting", "pen testing", "ethical hacking"] },
  { canonical: "OWASP",           category: "security", aliases: ["owasp", "secure coding"] },
  { canonical: "OAuth",           category: "security", aliases: ["oauth", "oauth2", "oidc", "jwt", "authentication"] },
  { canonical: "Zero Trust",      category: "security", aliases: ["zero trust", "zero-trust"] },
  { canonical: "SIEM",            category: "security", aliases: ["siem", "security information and event management"] },
  { canonical: "PKI",             category: "security", aliases: ["pki", "ssl", "tls", "ssl/tls", "encryption"] },

  // ─── System Design & Architecture ────────────────────────────────────────────
  { canonical: "System Design",        category: "methodology", aliases: ["system design", "distributed systems", "large scale systems"] },
  { canonical: "Microservices",         category: "methodology", aliases: ["microservices", "micro-services", "service mesh"] },
  { canonical: "Event-Driven Architecture", category: "methodology", aliases: ["event driven", "event-driven", "event sourcing", "cqrs"] },
  { canonical: "Serverless",           category: "methodology", aliases: ["serverless", "faas", "function as a service"] },
  { canonical: "API Design",           category: "methodology", aliases: ["api design", "api development", "openapi", "swagger"] },
  { canonical: "Cloud Architecture",   category: "methodology", aliases: ["cloud architecture", "cloud-native", "cloud native"] },

  // ─── Agile & Methodology ─────────────────────────────────────────────────────
  { canonical: "Agile",            category: "methodology", aliases: ["agile", "scrum", "kanban", "sprint planning"] },
  { canonical: "DevOps Culture",   category: "methodology", aliases: ["devops culture", "devops practices"] },
  { canonical: "Test-Driven Development", category: "methodology", aliases: ["tdd", "test driven", "test-driven development"] },
  { canonical: "Code Review",      category: "methodology", aliases: ["code review", "peer review", "pull requests"] },

  // ─── Soft Skills ─────────────────────────────────────────────────────────────
  { canonical: "Communication",    category: "soft_skill", aliases: ["communication", "verbal communication", "written communication", "interpersonal"] },
  { canonical: "Leadership",       category: "soft_skill", aliases: ["leadership", "team lead", "people management", "mentoring", "mentorship"] },
  { canonical: "Problem Solving",  category: "soft_skill", aliases: ["problem solving", "analytical thinking", "troubleshooting", "debugging"] },
  { canonical: "Collaboration",    category: "soft_skill", aliases: ["collaboration", "teamwork", "cross-functional"] },
  { canonical: "Project Management",category:"soft_skill", aliases: ["project management", "stakeholder management", "roadmapping"] },

  // ─── Tools ───────────────────────────────────────────────────────────────────
  { canonical: "Jira",             category: "tool", aliases: ["jira", "atlassian jira"] },
  { canonical: "Confluence",       category: "tool", aliases: ["confluence"] },
  { canonical: "Figma",            category: "tool", aliases: ["figma"] },
  { canonical: "VS Code",          category: "tool", aliases: ["vs code", "vscode", "visual studio code"] },
  { canonical: "IntelliJ",         category: "tool", aliases: ["intellij", "jetbrains"] },
  { canonical: "Postman",          category: "tool", aliases: ["postman"] },
  { canonical: "Webpack",          category: "tool", aliases: ["webpack", "bundler"] },
  { canonical: "Vite",             category: "tool", aliases: ["vite"] },
  { canonical: "Jest",             category: "tool", aliases: ["jest", "unit testing", "testing library"] },
  { canonical: "Playwright",       category: "tool", aliases: ["playwright", "end-to-end testing", "e2e testing"] },
  { canonical: "Cypress",          category: "tool", aliases: ["cypress"] },
  { canonical: "Storybook",        category: "tool", aliases: ["storybook"] },
  { canonical: "Linear",           category: "tool", aliases: ["linear"] },
  { canonical: "Notion",           category: "tool", aliases: ["notion"] },

  // ─── Blockchain / Web3 ───────────────────────────────────────────────────────
  { canonical: "Blockchain",       category: "platform", aliases: ["blockchain", "web3", "decentralized", "defi"] },
  { canonical: "Ethereum",         category: "platform", aliases: ["ethereum", "eth", "evm"] },

  // ─── Platform / Runtime ──────────────────────────────────────────────────────
  { canonical: "WebAssembly",      category: "platform", aliases: ["webassembly", "wasm"] },
  { canonical: "Edge Computing",   category: "platform", aliases: ["edge computing", "edge functions"] },
  { canonical: "IoT",              category: "platform", aliases: ["iot", "internet of things", "embedded systems"] },
];

/** Build a lookup map: lowercase alias → canonical name, for O(1) matching */
export const ALIAS_TO_CANONICAL: Map<string, string> = new Map(
  SKILL_TAXONOMY.flatMap(entry =>
    entry.aliases.map(alias => [alias.toLowerCase(), entry.canonical])
  )
);

/** Build a set of all canonical skill names */
export const ALL_CANONICAL_SKILLS: Set<string> = new Set(
  SKILL_TAXONOMY.map(e => e.canonical)
);
