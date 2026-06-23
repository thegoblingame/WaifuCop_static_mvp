import ProductivityChart from './ProductivityChart';
import { MOCK_DATA } from './mockData';

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
      </header>

      <ProductivityChart data={MOCK_DATA} />
    </main>
  );
}
