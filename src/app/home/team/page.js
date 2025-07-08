
import Footer from '@/components/Footer';
import Team from '@/components/Team';
import React from 'react';
export const metadata = {
  title: "YantarneFM | Команда",
  description: "YantarneFM | Команда",
};

const Page = () => {
  return (
    <main className='w-full h-full'>
      <Team/>
      <Footer/>
    </main>
  )
}

export default Page