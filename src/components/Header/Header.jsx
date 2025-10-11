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
    <Link href="/home"  aria-label="На головну сторінку">
      <Image src="/logo.webp" width={150} height={150} alt="" className="logo" />
    </Link>
    <div className="nav-wrapper">
      <nav>
        <a href="/home">Головна</a>
        <a href="/home/#timetable">Розклад</a>
        <a href="/home/#about">Хто ми</a>
        <Link href="/blog">Блог</Link>
        <a href="/home/#news">Новини</a>
        <a href="/home/#team">Команда</a>
      </nav>
    <Link href='/navigation' aria-label="Відкрити меню навігації">
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