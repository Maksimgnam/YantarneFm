import About from '@/components/About';
import Footer from '@/components/Footer';
import React from 'react';
export const metadata = {
  title: "YantarneFM | Хто ми",
  description: "YantarneFM | Хто ми",
};

const Page = () => {
  return (
    <main className='w-full h-full'>
      <About/>
      <Footer/>
    </main>
  )
}

export default Page