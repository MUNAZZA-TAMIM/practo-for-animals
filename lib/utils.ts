import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(value));
}

export function formatDateTime(value: string | Date | number) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function relativeTime(value: string | Date) {
  const date = new Date(value).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - date);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(value);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function titleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function truncate(value: string, length: number) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
}

/** Only allow same-origin, single-slash paths to prevent open redirects. */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || value.includes("\n") || value.includes("\r")) {
    return fallback;
  }
  return value;
}

export function pickInitialsColor(seed: string) {
  const palettes = [
    "bg-mint-200 text-forest-900",
    "bg-[#F7E5D9] text-coral-ink",
    "bg-[#E8E2F0] text-[#4E3C69]",
    "bg-[#F4EACB] text-[#6F5417]",
  ];
  const index = seed
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);
  return palettes[index % palettes.length];
}
