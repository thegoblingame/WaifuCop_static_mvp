import { DayProductivity, Subject, SUBJECTS, SubjectMinutes } from './types';

// Generates ~120 days of mock productivity data ending today.
// This stands in for the database response until we wire up the real source.
// Each day's total productive time is kept at/under 10 hours (600 min) so it
// fits the chart's 10-hour y-axis cap.

// Simple deterministic PRNG so the mock data is stable between renders/reloads.
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function emptyMinutes(): SubjectMinutes {
  return { Coding: 0, Studying: 0, Writing: 0, Other: 0 };
}

function generateDay(date: string, rand: () => number, dayOfWeek: number): DayProductivity {
  const productive = emptyMinutes();

  // Lighter activity on weekends.
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const activityScale = isWeekend ? 0.4 : 1;

  // Roughly how many subjects the user touched that day (0-4).
  const subjectCount = Math.floor(rand() * 4 * activityScale + (isWeekend ? 0 : 1));

  // Pick that many distinct subjects, weighted toward Coding/Studying.
  const pool: Subject[] = [...SUBJECTS];
  let totalMinutes = 0;
  const dailyCapMinutes = 600; // 10 hours

  for (let i = 0; i < subjectCount && pool.length > 0; i++) {
    const idx = Math.floor(rand() * pool.length);
    const subject = pool.splice(idx, 1)[0];
    // Up to ~3.5h on a single subject in one day.
    const minutes = Math.round(rand() * 210 * activityScale);
    const allowed = Math.min(minutes, dailyCapMinutes - totalMinutes);
    productive[subject] = allowed;
    totalMinutes += allowed;
  }

  return {
    date,
    productive_minutes: productive,
    // Intervals aren't used by the bar chart; included for shape completeness.
    intervals: [],
  };
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function generateMockData(days = 120, endDate = new Date()): DayProductivity[] {
  const rand = mulberry32(20260623);
  const result: DayProductivity[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    result.push(generateDay(toISODate(d), rand, d.getDay()));
  }

  return result;
}

// 120 days of data — components slice the tail for shorter timeframes.
export const MOCK_DATA: DayProductivity[] = generateMockData(120);
