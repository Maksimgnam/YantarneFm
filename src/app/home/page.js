import About from "@/components/About";
import Adds from "@/components/Adds";
import CNNLine from "@/components/CNNLine";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Home from "@/components/Home";
import Partners from "@/components/Partners";
import Support from "@/components/Support";
import Team from "@/components/Team";
import Timetable from "@/components/Timetable";
import TopSongs from "@/components/TopSongs";

export const metadata = {
  title: "Yantarne FM - радіо рідного міста",
  description: "Yantarne FM - радіо рідного міста",
};

export default function Page() {
  return (

      <main className="w-full h-full">
        <CNNLine/>
        <Header/>
        <Home/>
       <Timetable/>
       <About/>
       <Team/>
       <Partners/>
       <Support/>
       <Adds/>
       <TopSongs/>
       <Contacts/>
       <Footer/>
      </main>
     
  );
}