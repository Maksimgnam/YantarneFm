import Footer from '@/components/Footer';
import Timetable from '@/components/Timetable';
import React from 'react';
export const metadata = {
  title: "YantarneFM | Розклад",
  description: "YantarneFM | Розклад",
};

const Page = () => {
  return (
    <main className='w-full h-full'>
      <Timetable/>
      <Footer/>
    </main>
  )
}

export default Page