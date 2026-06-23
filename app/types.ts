// Shape of the productivity data the frontend receives from the backend/database.
// The page consumes an array of these — one object per calendar day.

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

export interface Interval {
  failed: boolean;
  reasoning: string;
  productive_minutes: SubjectMinutes;
  unproductive_minutes: number;
  afk_minutes: number;
  timestamp: string;
}

export interface DayProductivity {
  date: string; // YYYY-MM-DD
  productive_minutes: SubjectMinutes;
  intervals: Interval[];
}
