import { getCollection, getLiveCollection, type CollectionEntry } from "astro:content";

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
  price: number;
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
    price: session.data.price,
    signUpURL: session.data.signUpURL,
  };
}

/**
 * Build a mapping from backofficeID to training slug
 */
export async function getTrainingIDToSlugMap(): Promise<Map<number, string>> {
  const trainings = await getCollection("training");
  const map = new Map<number, string>();
  for (const training of trainings) {
    // Exclude drafts (backofficeID: -1)
    if (training.data.backofficeID > 0) {
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
