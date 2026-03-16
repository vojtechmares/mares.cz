import { getCollection, getLiveCollection, type CollectionEntry } from "astro:content";
import { getCurrencyForLocale } from "../i18n/formatting";
import type { Locale } from "../i18n/types";

type Session = CollectionEntry<"session">;

export interface TrainingSession {
  trainingID: number;
  trainingSlug?: string;
  trainingDescription?: string;
  name: string;
  dates: {
    start: string;
    end?: string;
  };
  location: string;
  pricing: Array<{ currency: "CZK" | "EUR"; amount: number }>;
  signUpURL?: string;
}

/**
 * Get all future sessions sorted by start date (ascending)
 */
export async function getFutureSessions(): Promise<Session[]> {
  const { entries = [] } = await getLiveCollection("session");
  const today = new Date().toISOString().split("T")[0];

  return entries
    .filter((session) => session.data.dates.start >= today)
    .sort((a, b) => new Date(a.data.dates.start).getTime() - new Date(b.data.dates.start).getTime());
}

/**
 * Get future sessions filtered by name
 */
export async function getFutureSessionsByName(name: string): Promise<Session[]> {
  const sessions = await getFutureSessions();
  return sessions.filter((s) => s.data.name.toLowerCase() === name.toLowerCase());
}

/**
 * Transform collection entry to TrainingSession interface
 * for backward compatibility with existing components
 */
export function toTrainingSession(session: Session): TrainingSession {
  return {
    trainingID: session.data.trainingID,
    name: session.data.name,
    dates: session.data.dates,
    location: session.data.location,
    pricing: session.data.pricing,
    signUpURL: session.data.signUpURL,
  };
}

/**
 * Get the price amount for a given locale from a pricing array.
 * Falls back to the first entry if the locale's currency is not found.
 */
export function getSessionPrice(pricing: Array<{ currency: "CZK" | "EUR"; amount: number }>, locale: Locale): number {
  const currency = getCurrencyForLocale(locale);
  const match = pricing.find((p) => p.currency === currency);
  return match ? match.amount : pricing[0].amount;
}

/**
 * Build a mapping from backofficeID to training slug
 */
export async function getTrainingIDToSlugMap(): Promise<Map<number, string>> {
  const trainings = await getCollection("training");
  const map = new Map<number, string>();
  for (const training of trainings) {
    // Exclude drafts (backofficeID: -1) and English entries (use Czech slugs as canonical)
    if (training.data.backofficeID > 0 && !training.id.includes("/")) {
      map.set(training.data.backofficeID, training.id);
    }
  }
  return map;
}

/**
 * Enrich sessions with training slugs for linking
 */
export function enrichSessionsWithSlugs(sessions: TrainingSession[], slugMap: Map<number, string>): TrainingSession[] {
  return sessions.map((session) => ({
    ...session,
    trainingSlug: slugMap.get(session.trainingID),
  }));
}
