import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import SkillTicker from '@/modules/core/components/SkillTicker';
import Sidebar from '@/modules/core/components/Sidebar';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

export const metadata: Metadata = {
  title: 'SkillQuant | Career Intelligence Platform',
  description: 'Bloomberg-style analytics for software engineering skills',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jbMono.variable}`}>
      <body className="bg-[#0d1117] text-[#e6edf3] min-h-screen flex flex-col font-sans">
        <SkillTicker />
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-[#0d1117] to-[#121820]">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
        </div>
      </body>
    </html>
  );
}
