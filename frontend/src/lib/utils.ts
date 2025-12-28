import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind classes efficiently.
 * Resolves conflicts (e.g., 'bg-red-500' vs 'bg-blue-500') properly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
