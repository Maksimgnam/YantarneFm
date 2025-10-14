import { Geist, Geist_Mono, Madimi_One, Montserrat_Alternates, Unbounded } from "next/font/google";
import "./globals.css";
import '../styles/global.scss'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yantarne FM - радіо рідного міста",
  description: "Yantarne FM - радіо рідного міста",
};



const montserrat = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/headphones.webp" type="image/x-icon" />
      <link rel="preconnect" href="https://yantarne-beta.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
