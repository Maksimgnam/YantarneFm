
import { Geist, Geist_Mono, Madimi_One, Montserrat_Alternates, Unbounded } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yantarne FM",
  description: "Yantarne FM",
};



const montserrat = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});



export default function HomeLayout({ children }) {
  return (
    <main className="w-full h-svh">
        <div className="w-full h-full">
            {children}
        </div>
    </main>
  );
}
