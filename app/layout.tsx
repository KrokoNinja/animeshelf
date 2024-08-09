import type { Metadata } from 'next';
import { Kanit, Anton } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-kanit',
});
const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
});

export const metadata: Metadata = {
  title: 'AnimeShelf',
  description: 'Your anime list, your way.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${kanit.variable}`}>
      <body className="h-screen w-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange>
          <Navbar />
          <main className="mt-20 p-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
