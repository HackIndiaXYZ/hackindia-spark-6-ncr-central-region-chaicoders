# 🔑 API Keys & Environment Variables

This document describes all the environment variables and API keys required to run the **Career Intelligence System** project locally and in production.

> ⚠️ **NEVER commit `.env.local` or any file containing real API keys to version control.** The `.gitignore` already excludes all `.env*` files.

---

## 📁 Environment File

Create a file named `.env.local` in the **root** of the project (next to `package.json`).

```
career intelligence system/
├── .env.local        ← create this file
├── package.json
├── src/
└── ...
```

---

## 🔐 Required Variables

### Supabase (Authentication & Database)

These keys connect the app to your Supabase project. They are used in `src/lib/supabase.ts`.

| Variable | Description | Prefix | Where to Find |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key (safe for client-side) | `eyJ...` | Supabase Dashboard → Project Settings → API |
| `LLM_GATEWAY_API_KEY` | Your LLM Gateway API Key (server-side only) | `lg-` | https://llmgateway.io/ dashboard |
| `LLM_GATEWAY_BASE_URL` | Base URL for the gateway | `https://` | Set to `https://api.llmgateway.io/v1` |
| `GOOGLE_GEMINI_API_KEY` | Direct API key for Google Gemini | `AIza...` | Google AI Studio (https://aistudio.google.com/) |
| `RAPIDAPI_KEY` | JSearch API Key (for real jobs) | `...` | https://rapidapi.com/jsearch-api-jsearch-api-default/api/jsearch/ |

> ℹ️ Variables prefixed with `NEXT_PUBLIC_` are **exposed to the browser**. They are safe to use on the client side because Supabase Row Level Security (RLS) policies protect your data.

---

## 📋 `.env.local` Template

Copy the block below into your `.env.local` file and fill in your values:

```env
# ─────────────────────────────────────────────
# Supabase Configuration
# Get these from: https://supabase.com/dashboard
# → Your Project → Project Settings → API
# ─────────────────────────────────────────────

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# LLM Gateway (Free AI Gateway)
LLM_GATEWAY_API_KEY=your_llmgateway_api_key_here
LLM_GATEWAY_BASE_URL=https://api.llmgateway.io/v1

# Google Gemini (Direct API)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# RapidAPI (JSearch)
RAPIDAPI_KEY=your_rapidapi_key_here
```

---

## 🚀 How to Get Your Supabase Keys

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **API**
4. Copy the **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the **anon / public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🌐 Deploying to Production (Vercel)

When deploying to Vercel, **do not** upload your `.env.local` file. Instead:

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below manually:

| Variable Name | Environment |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |

---

## 🔒 Security Notes

- The **Anon Key** is safe for browser use — it's a **public** key. Data access is protected by Supabase's **Row Level Security (RLS)** policies.
- Never use or expose the **Service Role Key** on the client side. It bypasses all RLS policies.
- Rotate your keys immediately in Supabase if you ever accidentally commit them.

---

## 🗂️ File Reference

| File | Purpose |
|---|---|
| `.env.local` | Local environment variables (git-ignored) |
| `src/lib/supabase.ts` | Supabase client initialised using these env vars |
| `.gitignore` | Ensures `.env*` files are never committed |