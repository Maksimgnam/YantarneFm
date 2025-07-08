


'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const Home = () => {
  const [volume, setVolume] = useState(50)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackInfo, setTrackInfo] = useState({ title: '', artist: '' })
  const audioRef = useRef(null)

  const streamUrl = 'https://complex.in.ua/yantarne' 

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const increase = () => {
    const newVolume = Math.min(100, volume + 10)
    setVolume(newVolume)
    if (audioRef.current) audioRef.current.volume = newVolume / 100
  }

  const decrease = () => {
    const newVolume = Math.max(0, volume - 10)
    setVolume(newVolume)
    if (audioRef.current) audioRef.current.volume = newVolume / 100
  }

  useEffect(() => {
    const fetchTrackInfo = async () => {
      try {
        const res = await fetch('https://complex.in.ua/status-json.xsl?mount=/yantarne')
        const data = await res.json()
        const [artist, title] = data.icestats.source.title.split(' - ')
        setTrackInfo({ artist, title })
      } catch (err) {
        console.error('Error fetching track info:', err)
      }
    }

    fetchTrackInfo()
    const interval = setInterval(fetchTrackInfo, 10000) // update every 10s
    return () => clearInterval(interval)
  }, [])

  return (
    <main className='w-full h-full flex flex-col justify-between'>

      <audio ref={audioRef} src={streamUrl} preload='none' />

      <div></div>

      <div className='w-full flex justify-between p-14'>
        <div>
          <h2 className='text-7xl font-bold first-letter:text-[#Cc0100]'>{trackInfo.title || 'Loading...' }</h2>
          <h3 className='text-5xl font-bold m-4 ml-0 mr-0'>{trackInfo.artist || ''}</h3>
        </div>

        <div className='flex items-center justify-center'>
          <button
            onClick={togglePlay}
            className='w-[130px] h-[130px] bg-[#Cc0100] hover:shadow-2xl cursor-pointer rounded-full flex items-center justify-center m-5 mb-0 mt-0'
          >
            {isPlaying ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="white" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="85" height="80" fill="white" viewBox="0 0 24 24" className='rounded'>
    <path d="M8 5v14l11-7z"/>
  </svg>
)}
          </button>

          <button className='w-[130px] h-[130px] bg-white border-2 border-[#Cc0100] hover:shadow-2xl cursor-pointer rounded-full flex items-center justify-center m-5 mb-0 mt-0'>
            <Image src={'/heart.png'} width={50} height={50} alt='Heart' />
          </button>
        </div>
      </div>


      {/* <div className='flex justify-center gap-4 p-4'>
        <button onClick={decrease} className='px-4 py-2 bg-gray-300 rounded'>-</button>
        <span className='text-xl font-bold'>{volume}%</span>
        <button onClick={increase} className='px-4 py-2 bg-gray-300 rounded'>+</button>
      </div> */}

      <div className='w-full h-72'></div>
    </main>
  )
}

export default Home
