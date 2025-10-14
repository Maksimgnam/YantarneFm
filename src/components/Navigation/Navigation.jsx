import React from 'react';
import './Navigation.scss'
import Link from 'next/link';

const Navigation = () => {
  return (
    <main className='navigation'>
        <div className="navigation-header">
        <Link href={'/'} aria-label="Відкрити меню навігації">
            <button>X</button>
            </Link>    
        </div>
        <div className='button-container'>
            <Link className='w-full' href={'/'}>
                <button>Головна</button>
            </Link>
            <Link className='w-full' href={'/home/#timetable'}>
                <button>Розклад</button>
            </Link>
            <Link className='w-full' href={'/home/#about'}>
                <button>Хто ми</button>
            </Link>
            <Link className='w-full' href={'/blog'}>
                <button>Блог</button>
            </Link>
            <Link className='w-full' href={'/home/#team'}>
                <button>Команда</button>
            </Link>
            <Link className='w-full' href={'/home/#contacts'}>
                <button>Контакти</button>
            </Link>
        </div>
    </main>
  )
}

export default Navigation