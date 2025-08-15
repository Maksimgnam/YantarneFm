'use client'
import React, { useState } from 'react';
import './AdminTopSongCard.scss'

const AdminTopSongCard = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <div className='admin-topsong-card'>
      <h2>1</h2>
      <img src="" alt="" />
      <p>Антитiла — Вдома</p>
      <input type="range" className='volume-control' />
      <div className='flex  items-center'>
        <button className='play' onClick={()=> setIsPlaying(!isPlaying)}>
        {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" className='rounded' viewBox="0 0 24 24" fill="#CC0100">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="#CC0100">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
        </button>
        <button className='edit'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='pl-1' width="40" height="40" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 21l3-1 11-11a3 3 0 0 0-4-4L2 16v5z"/>
    <path d="M14 7l3 3"/>
  </g>
</svg>
        </button>
      </div>
    </div>
  )
}

export default AdminTopSongCard