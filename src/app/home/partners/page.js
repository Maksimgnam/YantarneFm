import Footer from '@/components/Footer';
import Partners from '@/components/Partners';
import React from 'react';
export const metadata = {
  title: "YantarneFM | Партнери",
  description: "YantarneFM | Партнери",
};

const Page = () => {
  return (
    <main className='w-full h-full'>
      <Partners/>
      <Footer/>
    </main>
  )
}

export default Page