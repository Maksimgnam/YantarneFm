'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './Header.scss'

const Header = () => {
  const router = useRouter()
  const handleTelegramLogin = () => {
    window.open('https://t.me/', '_blank')


    setTimeout(() => {
      router.push('/pincode')
    }, 500)
  }
  return (
    <header className="header">
    <Link href="/home">
      <Image src="/logo.webp" width={150} height={150} alt="" className="logo" />
    </Link>
    <div className="nav-wrapper">
      <nav>
        <a href="/home">Головна</a>
        <a href="/home/#timetable">Розклад</a>
        <a href="/home/#about">Хто ми</a>
        <Link href="/blog">Блог</Link>
        <a href="/home/#support">Підтримати</a>
        <a href="/home/#team">Команда</a>
      </nav>
      {/* <button onClick={handleTelegramLogin} className="register-btn">
        Зареєструватися
      </button> */}
        <Link href={'/navigation'}>
    <div className="menu">
      <div className="menu-line"></div>
      <div className="menu-line"></div>
      <div className="menu-line"></div>
    </div>
    </Link>
    </div>
  
  </header>
  
  )
}

export default Header