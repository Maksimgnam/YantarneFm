import React from 'react';
import './Navigation.scss'
import Link from 'next/link';

const Navigation = () => {
  return (
    <main className='navigation'>
        <div className="navigation-header">
        <Link href={'/'}>
            <button>X</button>
            </Link>    
        </div>
        {/* <div className="top">
            <Link href={'/account'}>
                <button className='btn'>
                Мій профіль
                </button>
            </Link>   
            <Link href={'/tapalka'}>
                <button className='btn tapalka'>
                Тапалка
                </button>
            </Link>
        </div>
        <div className='line'></div> */}
        <div className='button-container'>
            <Link className='w-full' href={'/home'}>
                <button>Головна</button>
            </Link>
            <Link className='w-full' href={'/home/#timatable'}>
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