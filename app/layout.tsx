import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WaifuCop — Productivity',
  description: 'Track productive time spent per subject over time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
