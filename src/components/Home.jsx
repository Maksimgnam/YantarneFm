'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter()

  const handleTelegramLogin = () => {
    window.open('https://t.me/', '_blank')


    setTimeout(() => {
      router.push('/pincode')
    }, 500)
  }

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <Image src={'/logo.webp'} width={200} height={200} alt='' className='m-5 rounded-3xl' />
      <button
        onClick={handleTelegramLogin}
        className='w-80 h-[70px] bg-[#F94D4D] rounded-3xl text-xl font-medium cursor-pointer m-2 ml-0 mr-0 flex items-center justify-center'
      >
        <p className='text-[27px] pr-3'>Увійти за</p>
        <Image src={'/telegram.webp'} width={38} height={38} alt='' />
      </button>
    </div>
  )
}

export default Home
