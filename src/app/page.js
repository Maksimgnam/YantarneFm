"use client";

import { useState, useEffect } from "react";
import About from "@/components/About/About";
import Ads from "@/components/Ads/Ads";
import CNNLine from "@/components/CNNLine/CNNLine";
import Contacts from "@/components/Contacts/Contacts";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Home from "@/components/Home/Home";
import Loader from "@/components/Loader/Loader";
import Support from "@/components/Support/Support";
import Team from "@/components/Team/Team";
import Timetable from "@/components/Timetable/Timetable";
import TopSongs from "@/components/TopSongs/TopSongs";



export default function Page() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  if (showLoader) return <Loader />;

  return (
    <main className="w-full h-full">
      <CNNLine />
      <main className="w-full bg-cover h-full">
        <Header />
        <Home />
      </main>
      <Timetable />
      <About />
      <Team />
      <Support />
      <Ads />
      <TopSongs />
      <Contacts />
      <Footer />
    </main>
  );
}
