'use client';
import React, { useEffect } from 'react';
import './Loader.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Loader = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className='loader'>
      <Image 
        src='/logo.webp' 
        width={230} 
        height={230} 
        alt='Logo' 
        className='m-4' 
      />

      <div className='loading-line-container'>
        <div className='loading-line'></div>
      </div>
    </main>
  );
};

export default Loader;
