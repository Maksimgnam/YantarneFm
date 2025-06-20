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
    <div className='w-full h-full flex flex-col justify-between items-center p-5'>
      <Image src={'/logo.webp'} width={250} height={200} alt='' className=' rounded-3xl' />
      <button
        onClick={handleTelegramLogin}
        className='w-[440px] text-white h-[76px] bg-[#CC0100] font-bold rounded-lg text-xl cursor-pointer m-2 ml-0 mr-0 flex items-center justify-center'
      >
        <p className='text-[24px] pr-3'>Зайти через телеграм </p>
        <Image src={'/telegram.webp'} width={38} height={38} alt='' />
      </button>
      <button></button>
    </div>
  )
}

export default Home
