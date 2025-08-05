import About from "@/components/About/About";
import Ads from "@/components/Ads/Ads";
import CNNLine from "@/components/CNNLine/CNNLine";
import Contacts from "@/components/Contacts/Contacts";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Home from "@/components/Home/Home";
import Partners from "@/components/Partners/Partners";
import Support from "@/components/Support/Support";
import Team from "@/components/Team/Team";
import Timetable from "@/components/Timetable/Timetable";
import TopSongs from "@/components/TopSongs/TopSongs";

export const metadata = {
  title: "Yantarne FM - радіо рідного міста",
  description: "Yantarne FM - радіо рідного міста",
};

export default function Page() {
  return (

      <main className="w-full h-full">
        <CNNLine/>
        <main style={{backgroundImage:"url('/back.png')"}} className="w-full bg-cover h-full">
        <Header/>
        <Home/>
        </main>
     
       <Timetable/>
       <About/>
       <Team/>
       <Partners/>
       <Support/>
       <Ads/>
       <TopSongs/>
       <Contacts/>
       <Footer/>
      </main>
     
  );
}