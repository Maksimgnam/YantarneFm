import Contacts from '@/components/Contacts';
import React from 'react';
export const metadata = {
  title: "YantarneFM | Контакти",
  description: "YantarneFM | Контакти",
};

const Page = () => {
  return (
    <main className='w-full h-full'>
      <Contacts/>
    </main>
  )
}

export default Page