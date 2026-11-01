import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-montserrat', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Backoffice | AL MACTOUM',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#0E1210', width: 'device-width', initialScale: 1 };

/** Mise en page du backoffice (séparée du site public : pas d'en-tête ni d'animations). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-mist">{children}</body>
    </html>
  );
}
