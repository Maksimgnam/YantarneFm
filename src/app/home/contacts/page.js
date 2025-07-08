import Contacts from '@/components/Contacts';
import Footer from '@/components/Footer';
import React from 'react';
export const metadata = {
  title: "YantarneFM | Контакти",
  description: "YantarneFM | Контакти",
};

const Page = () => {
  return (
    <main className='w-full h-full'>
      <Contacts/>
      <Footer/>
    </main>
  )
}

export default Page