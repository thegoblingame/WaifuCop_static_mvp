'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DayProductivity, Subject, SUBJECTS, SUBJECT_COLORS } from './types';

const TIMEFRAMES = [7, 30, 120] as const;
type Timeframe = (typeof TIMEFRAMES)[number];

const DEFAULT_TIMEFRAME: Timeframe = 30;
const Y_AXIS_MAX_HOURS = 10;

// Each row feeds one stacked bar: hours per subject for a single day.
type ChartRow = { date: string } & Record<Subject, number>;

function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

// Show fewer date labels on longer ranges so the axis stays readable.
function tickInterval(days: number): number {
  if (days <= 7) return 0; // every day
  if (days <= 30) return 2; // ~every 3rd day
  return 13; // ~every 2 weeks
}

function formatDate(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${month}/${day}`;
}

export default function ProductivityChart({ data }: { data: DayProductivity[] }) {
  const [timeframe, setTimeframe] = useState<Timeframe>(DEFAULT_TIMEFRAME);

  const rows = useMemo<ChartRow[]>(() => {
    const sliced = data.slice(-timeframe);
    return sliced.map((day) => {
      const row = { date: day.date } as ChartRow;
      for (const subject of SUBJECTS) {
        row[subject] = minutesToHours(day.productive_minutes[subject] ?? 0);
      }
      return row;
    });
  }, [data, timeframe]);

  return (
    <section style={styles.card}>
      <div style={styles.toolbar}>
        <h2 style={styles.subtitle}>Time spent by subject</h2>
        <div role="group" aria-label="Select time frame" style={styles.toggleGroup}>
          {TIMEFRAMES.map((tf) => {
            const active = tf === timeframe;
            return (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                aria-pressed={active}
                style={{
                  ...styles.toggleButton,
                  ...(active ? styles.toggleButtonActive : {}),
                }}
              >
                {tf} days
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={tickInterval(timeframe)}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              domain={[0, Y_AXIS_MAX_HOURS]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              label={{
                value: 'Hours',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#64748b' },
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`${value} h`, name]}
              labelFormatter={(label: string) => label}
              contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
            {SUBJECTS.map((subject) => (
              <Bar
                key={subject}
                dataKey={subject}
                stackId="productivity"
                fill={SUBJECT_COLORS[subject]}
                maxBarSize={48}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subtitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#0f172a',
  },
  toggleGroup: {
    display: 'inline-flex',
    background: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    border: 'none',
    background: 'transparent',
    color: '#475569',
    fontSize: 13,
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  toggleButtonActive: {
    background: '#ffffff',
    color: '#0f172a',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
  },
  chartWrap: {
    width: '100%',
    height: 360,
  },
};
