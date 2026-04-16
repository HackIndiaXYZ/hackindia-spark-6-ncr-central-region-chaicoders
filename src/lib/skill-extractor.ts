/**
 * Career Intelligence System — Skill Extractor
 *
 * Extracts canonical skills from raw job description text using
 * the SKILL_TAXONOMY alias map. Fast O(N×M) scan where N = words
 * in text and M = taxonomy size (small, ~300 entries).
 *
 * Does NOT call any LLM — pure local computation.
 */

import { ALIAS_TO_CANONICAL, SKILL_TAXONOMY } from "./skill-taxonomy";

export interface ExtractedSkill {
  canonical: string;
  /** Number of times any alias for this skill appeared in the text */
  mentionCount: number;
}

/**
 * Extract canonical skills from a job description.
 * Returns deduplicated skills with mention counts, sorted by count desc.
 */
export function extractSkillsFromText(text: string): ExtractedSkill[] {
  if (!text || text.length === 0) return [];

  const lower = text.toLowerCase();
  const counts = new Map<string, number>();

  for (const entry of SKILL_TAXONOMY) {
    for (const alias of entry.aliases) {
      // Use word-boundary-like check: look for alias surrounded by non-word chars
      // This prevents "C" matching inside "CI/CD" or "C#" inside "CSharp"
      const idx = lower.indexOf(alias);
      if (idx === -1) continue;

      // Simple boundary check: char before and after the alias
      const before = idx > 0 ? lower[idx - 1] : " ";
      const after = idx + alias.length < lower.length ? lower[idx + alias.length] : " ";
      const isWordBoundaryBefore = /[\s,.()\[\]{}'";:\-\n\/]/.test(before) || idx === 0;
      const isWordBoundaryAfter  = /[\s,.()\[\]{}'";:\-\n\/]/.test(after)  || idx + alias.length === lower.length;

      if (isWordBoundaryBefore && isWordBoundaryAfter) {
        counts.set(entry.canonical, (counts.get(entry.canonical) ?? 0) + 1);
        break; // No need to check more aliases for this skill
      }
    }
  }

  return Array.from(counts.entries())
    .map(([canonical, mentionCount]) => ({ canonical, mentionCount }))
    .sort((a, b) => b.mentionCount - a.mentionCount);
}

/**
 * Extract skill names only (no counts).
 * Convenience wrapper for use in market intelligence.
 */
export function extractSkillNames(text: string): string[] {
  return extractSkillsFromText(text).map(s => s.canonical);
}

/**
 * Check if a given canonical skill name appears in a text.
 */
export function skillAppearsInText(canonicalSkill: string, text: string): boolean {
  const entry = SKILL_TAXONOMY.find(e => e.canonical === canonicalSkill);
  if (!entry) return false;
  const lower = text.toLowerCase();
  return entry.aliases.some(alias => lower.includes(alias));
}

/**
 * Batch extract skills from multiple job descriptions.
 * Returns a map: skill → number of jobs that mentioned it.
 */
export function batchExtractSkillFrequency(descriptions: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const desc of descriptions) {
    const found = extractSkillsFromText(desc);
    for (const { canonical } of found) {
      freq.set(canonical, (freq.get(canonical) ?? 0) + 1);
    }
  }
  return freq;
}
