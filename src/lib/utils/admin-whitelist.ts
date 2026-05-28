import { ADMIN_WHITELIST } from "@/constants/site";

let cachedEmails: string[] | null = null;

function getParsedEmails(): string[] {
  if (cachedEmails) return cachedEmails;

  const envValue = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS;
  if (envValue) {
    cachedEmails = envValue
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  } else {
    cachedEmails = ADMIN_WHITELIST.map((e) => e.toLowerCase());
  }

  if (cachedEmails.length === 0) {
    console.warn(
      "No admin emails configured! Set NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS or update ADMIN_WHITELIST."
    );
  }

  return cachedEmails;
}

export function isAllowedAdmin(email: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  return getParsedEmails().includes(cleanEmail);
}

export function getAllowedAdminEmails(): string[] {
  return getParsedEmails();
}

export function clearAdminEmailCache() {
  cachedEmails = null;
}