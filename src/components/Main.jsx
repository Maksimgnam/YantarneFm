'use client';

import { useState, useEffect } from "react";
import About from "@/components/About/About";
import Ads from "@/components/Ads/Ads";
import CNNLine from "@/components/CNNLine/CNNLine";
import Contacts from "@/components/Contacts/Contacts";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Home from "@/components/Home/Home";
import Loader from "@/components/Loader/Loader";
import Team from "@/components/Team/Team";
import Timetable from "@/components/Timetable/Timetable";
import TopSongs from "@/components/TopSongs/TopSongs";
import News from "@/components/News/News";

export default function Main() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
        sessionStorage.setItem("hasVisited", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (showLoader) return <Loader />;

  return (
    <div className="w-full h-full">
      <CNNLine />

      <Header />
      <Home />

      <Timetable />
      <About />
      <Team />
      <News />
      <Ads />
      <TopSongs />
      <Contacts />
      <Footer />
    </div>
  );
}
