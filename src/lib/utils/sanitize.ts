// src/lib/utils/sanitize.ts
const scriptTagRegex = /<\s*script.*?>[\s\S]*?<\s*\/\s*script>/gi;
const htmlTagRegex = /<[^>]+>/g;

/**
 * Strips all HTML tags and limits whitespace.
 * For display only – not for rich‑text storage.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(scriptTagRegex, "")
    .replace(htmlTagRegex, "")
    .replace(/\s+/g, " ")
    .trim();
}