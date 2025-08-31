import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeInitializer from './ThemeInitializer';

export const metadata: Metadata = {
    title: 'Catiopia | 캣티오피아 집사 종합 플랫폼',
    description: '고양이 집사들을 위한 커뮤니티 Catiopia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <body className="min-h-screen flex flex-col">
        <ThemeInitializer />
        <Header />
        <main className="flex-1 p-4">{children}</main>
        <Footer />
        </body>
        </html>
    );
}
