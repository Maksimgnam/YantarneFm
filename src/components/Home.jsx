import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <div className='w-ful h-full flex justify-center items-center'>
      <Link href='/auth'>
        <button className='w-72 h-[60px] bg-[#F94D4D] rounded-4xl text-2xl font-medium cursor-pointer'>Увійти</button>
      </Link>
    </div>
  )
}

export default Home