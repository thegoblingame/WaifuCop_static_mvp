// Shape of the productivity data the frontend renders.
// app/data.json is the source of truth — these types mirror its structure.

export type Subject = 'Coding' | 'Studying' | 'Writing' | 'Other';

export const SUBJECTS: Subject[] = ['Coding', 'Studying', 'Writing', 'Other'];

// One color per subject, used by both the bars and the legend.
export const SUBJECT_COLORS: Record<Subject, string> = {
  Coding: '#4f46e5', // indigo
  Studying: '#0ea5e9', // sky
  Writing: '#f59e0b', // amber
  Other: '#94a3b8', // slate
};

export type SubjectMinutes = Record<Subject, number>;

// One calendar day, matching each entry in app/data.json's `days` array.
export interface DayProductivity {
  date: string; // YYYY-MM-DD
  productive_minutes: SubjectMinutes;
  productive_total: number;
  unproductive_minutes: number;
  afk_minutes: number;
  intervals: number; // count of intervals recorded that day
  failed: number; // count of intervals that failed
}

// Top-level shape of app/data.json (and the uvicorn endpoint's response).
export interface ProductivityData {
  days: DayProductivity[];
}
