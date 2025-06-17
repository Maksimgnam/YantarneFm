import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <div className='w-ful h-full flex flex-col justify-center items-center'>
      <Link href='/auth/signup'>
        <button className='w-72 h-[60px] bg-[#F94D4D] rounded-4xl text-xl font-medium cursor-pointer'>Зареєструватись</button>
      </Link>
      <p className='text-[#F94D4D] text-center font-medium m-4 ml-0 mr-0'>Або</p>
      <Link href='/auth/signin'>
        <button className='w-72 h-[60px] bg-[#F94D4D] rounded-4xl text-2xl font-medium cursor-pointer'>Увійти</button>
      </Link>
    </div>
  )
}

export default Home