import React from 'react'
import Signin from '@/components/Signin';

export const metadata = {
  title: "Yantarne FM | Увійти",
  description: "Yantarne FM | Увійти",
};

const Page = () => {
  return (
    <div className='w-full h-svh'>
      <Signin/>
    </div>
  )
}

export default Page