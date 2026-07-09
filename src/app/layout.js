import { Geist, Geist_Mono, Montserrat_Alternates } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import '../styles/global.scss';
import MiniPlayer from '@/components/MiniPlayer/MiniPlayer'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: "Yantarne FM – радіо рідного міста Новояворівськ | 97.6 FM",
  description:
    "Yantarne.FM — радіо рідного міста Новояворівськ. Слухайте нас онлайн та на хвилі 97,6 FM. Музика, новини, події та рідний настрій щодня.",

  verification: {
    google: "Kr1uNeAWUgWGTAaH2zoKxKNautFfvYh5DZfNyUtpyWI",
  },

  keywords: [
    "Yantarne FM",
    "Янтарне FM",
    "Новояворівськ радіо",
    "97.6 FM",
  ],

  openGraph: {
    title: "Yantarne FM – радіо рідного міста Новояворівськ | 97.6 FM",
    description:
      "Слухайте Yantarne.FM онлайн та на частоті 97,6 FM у Новояворівську.",
    url: "https://yantarne.fm",
    siteName: "Yantarne FM",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        {children}
        <MiniPlayer />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8S1CVFR5GM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8S1CVFR5GM');
          `}
        </Script>
      </body>
    </html>
  );
}