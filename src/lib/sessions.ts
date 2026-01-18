import { getCollection, type CollectionEntry } from "astro:content";

import type { TrainingSession } from "../interfaces/training";

export type Session = CollectionEntry<"session">;

/**
 * Get all future sessions sorted by start date (ascending)
 */
export async function getFutureSessions(): Promise<Session[]> {
  const sessions = await getCollection("session");
  const today = new Date().toISOString().split("T")[0];

  return sessions
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
    name: session.data.name,
    dates: session.data.dates,
    location: session.data.location,
    price: session.data.price,
    signUpURL: session.data.signUpURL,
  };
}
