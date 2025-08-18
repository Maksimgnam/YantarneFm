'use client'
import React, { useEffect, useState } from 'react';
import './AdminHomePage.scss';
import { useStore } from '@/store/store';
const AdminHomePage = () => {

  const [cnnTexts, setCnnTexts] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const fetchCnnTexts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/cnn-texts`);
      if (!res.ok) throw new Error('Failed to fetch CNN texts');
      const data = await res.json();
      setCnnTexts(data.cnnTexts || []);
    } catch (err) {
      console.error('Error loading CNN texts:', err);
    }
  };



  const fetchBackgroundImage = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/back-image`);
      if (!res.ok) throw new Error('Failed to fetch background image');
      const data = await res.json();
      if (data?.backgroundImage) {
        setBackgroundImage(data.backgroundImage);




      }
    } catch (err) {
      console.error('Error loading background image:', err);
    }
  };

  useEffect(() => {
    fetchCnnTexts();
    fetchBackgroundImage();

    const interval = setInterval(() => {
      fetchCnnTexts();
      fetchBackgroundImage();
    }, 3000);

    // cleanup
    return () => clearInterval(interval);
  }, []);


  const displayText = cnnTexts.length
    ? Array(20).fill(cnnTexts.map(item => item.text).join(' • ')).join(' ')
    : "Loading CNN texts... • ";


  return (
    <main className='admin-homepage'>


      <div className='cnnline'>
        <div className='cnnline-container'>
          <div className='cnnline-text'>{displayText}</div>
        </div>
        <button >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='pl-1' width="30" height="30">
            <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l3-1 11-11a3 3 0 0 0-4-4L2 16v5z"/>
              <path d="M14 7l3 3"/>
            </g>
          </svg>
        </button>
      </div>

      <div className='w-full'>
        {backgroundImage ? (
          <img src={backgroundImage} alt="Background" />
        ) : (
          <div></div>
        )}
        <button className='edit' >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='pl-1' width="47" height="47">
            <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l3-1 11-11a3 3 0 0 0-4-4L2 16v5z"/>
              <path d="M14 7l3 3"/>
            </g>
          </svg>
        </button>
      </div>


    </main>
  );
};

export default AdminHomePage;

