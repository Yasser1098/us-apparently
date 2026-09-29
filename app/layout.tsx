import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import FloatingDecorations from '@/components/FloatingDecorations';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Us, Apparently 💘',
  description: "A completely serious investigation into whether we'd get along.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-[100dvh] relative`}>
        <FloatingDecorations />
        <div className="relative z-10 w-full h-full min-h-[100dvh]">
          {children}
        </div>
      </body>
    </html>
  );
}
