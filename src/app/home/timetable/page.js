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
    </main>
  )
}

export default Page