import ProductivityChart from './ProductivityChart';
import { ProductivityData } from './types';
import rawData from './data.json';

// app/data.json is the single source of truth. It's refreshed by
// scripts/update-and-deploy.sh (reads your local DB via uvicorn and bakes the
// result in at build time). The chart renders whatever's in here.
const { days } = rawData as ProductivityData;

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 920,
        margin: '0 auto',
        padding: '40px 20px',
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#0f172a' }}>
          WAIFUCOP
        </h1>
        <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 15 }}>
          Productivity — hours spent per subject
        </p>

        <p
          style={{
            margin: '16px 0 0',
            padding: '12px 14px',
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderLeft: '4px solid #f59e0b',
            borderRadius: 8,
            color: '#9a3412',
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        >
          <strong>WIP:</strong> this is a work in progress for measuring grant&apos;s
          productivity on his personal laptop, which he uses for leetcode and side
          projects. this is vibecoded as fuck so it&apos;s gonna be buggy.
        </p>
      </header>

      <ProductivityChart data={days} />
    </main>
  );
}
