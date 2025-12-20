import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert multiline recommendation text into a single string
 * Backend expects ONE string
 * Points are separated by EMPTY LINES
 */
export const stringifyRecommendationPoints = (value?: string): string => {
  if (!value || typeof value !== "string") return "";

  return value
    .split(/\n\s*\n/)           // split by empty lines
    .map(p => p.replace(/\n/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");              // re-join with empty line
};


/**
 * Convert backend recommendation string into array of points
 * Used for displaying as list
 */
export const parseRecommendationPoints = (value?: string): string[] => {
  if (!value || typeof value !== "string") return [];

  return value
    .split(/\n\s*\n/)
    .map(p => p.replace(/^●\s*/g, " ").replace(/\n/g, " ").trim())
    .filter(Boolean);
};


export const retryFetch = async (url: string, options: RequestInit, retries = 3, delay = 500): Promise<Response> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && attempt < retries - 1) {
        await new Promise(res => setTimeout(res, delay * (attempt + 1))); // Exponential backoff
        continue;
      }
      return response;
    } catch (err) {
      if (attempt < retries - 1) {
        await new Promise(res => setTimeout(res, delay * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Failed after retries");
};
