import { Geist, Geist_Mono, Montserrat_Alternates } from "next/font/google";
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
  keywords: [
    "Yantarne FM",
    "Янтарне FM",
    "Новояворівськ радіо",
    "97.6 FM",
    "слухати радіо онлайн",
    "радіостанція Новояворівськ",
  ],
  openGraph: {
    title: "Yantarne FM – радіо рідного міста Новояворівськ | 97.6 FM",
    description:
      "Слухайте Yantarne.FM онлайн та на частоті 97,6 FM у Новояворівську. Музика, новини та події нашого міста.",
    url: "https://yantarne.fm",
    siteName: "Yantarne FM",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yantarne FM – радіо рідного міста Новояворівськ",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
      </body>
    </html>
  );
}
