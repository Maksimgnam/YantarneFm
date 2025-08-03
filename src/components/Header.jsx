'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter()
  const handleTelegramLogin = () => {
    window.open('https://t.me/', '_blank')


    setTimeout(() => {
      router.push('/pincode')
    }, 500)
  }
  return (
    <header className='w-full h-auto  flex items-center justify-between  p-2 pl-14 pr-12'>
      <Link href='/home'>
        <Image src={'/logo.webp'} width={150} height={150} alt='' className='rounded-3xl cursor-pointer' />
      </Link>
      <div className='w-auto flex  items-center'>
      <nav className='w-auto flex items-center mr-5'>
          <a className='text-lg hover:text-[#Cc0100] font-semibold m-2.5 mt-0 mb-0'  href='/home'>Головна</a>
          <a className='text-lg hover:text-[#Cc0100] font-semibold m-2.5 mt-0 mb-0'  href='/home/#timetable'>Розклад</a>
          <a className='text-lg hover:text-[#Cc0100] font-semibold m-2.5 mt-0 mb-0'  href='/home/#about'>Хто ми</a>
          <Link className='text-lg hover:text-[#Cc0100] font-semibold m-2.5 mt-0 mb-0'  href='/blog'>Блог</Link> 
          <a className='text-lg hover:text-[#Cc0100] font-semibold m-2.5 mt-0 mb-0'  href='/home/team'>Команда</a>  
          <a className='text-lg hover:text-[#Cc0100] font-semibold m-2.5 mt-0 mb-0'  href='/home/#partners'>Партнери</a>   
          <a className='text-lg hover:text-[#Cc0100] font-semibold m-2.5 mt-0 mb-0'  href='/home/#contacts'>Контакти</a>  
                     
          
          {/* <Link className='text-lg hover:text-[#Cc0100] font-semibold m-2.5 mt-0 mb-0'  href='/home/support'>Підтримати</Link>   */}
      </nav>
      <button onClick={handleTelegramLogin} className='w-56 text-white h-[56px] bg-[#Cc0100]  font-semibold rounded-lg text-lg cursor-pointer m-2 ml-0 mr-0 flex items-center justify-center'>
          Зареєструватися
      </button>
      </div>
    </header>
  )
}

export default Header