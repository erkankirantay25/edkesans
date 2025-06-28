// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Esanscim',
  description: 'Grup alım platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* Header ve Footer'ı geçici olarak kaldırdık */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}