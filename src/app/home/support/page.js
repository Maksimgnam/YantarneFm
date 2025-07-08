import Footer from '@/components/Footer';
import Support from '@/components/Support';
import React from 'react';
export const metadata = {
    title: "YantarneFM | Підтримати",
    description: "YantarneFM | Підтримати",
  };

const Page = () => {
  return (
    <main className='w-full h-full'>
        <Support/>
        <Footer/>
    </main>
  )
}

export default Page