import Auth from '@/components/Auth'
import React from 'react'

export const metadata = {
  title: "Yantarne FM | Увійти",
  description: "Yantarne FM | Увійти",
};

const Page = () => {
  return (
    <div className='w-full h-svh'>
      <Auth/>
    </div>
  )
}

export default Page