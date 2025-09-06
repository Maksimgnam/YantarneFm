"use client";
import React, {useState, useEffect} from 'react'
import './Support.scss'
import Image from 'next/image'

const Support = () => {

  const [news, setNews] = useState({text: "loading...", url: "loading..."});

  const fetchNews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/getVideoPage`);
      if (!response.ok) {
        console.log("Responce is not ok :(")
        return;
      } else {
        const data = await response.json();
        let url = data[0].url;
        let text = data[0].text;
        setNews({text, url});
      }
    } catch (error) {
      console.log("Error during fetching videoPage news:", error);
      return;
    }
  }

  useEffect(()=>{
    fetchNews()
  }, [])

  useEffect(()=>{
    console.log(news)
  }, [news])

  return (
    <main id='support' className='support'>
      <h2 className='title'><span>{news.text.slice(0, 1)}</span>{news.text.slice(1)}</h2>
      <div className='line'></div>
      <iframe
        className='support-video'
        src={`https://www.youtube.com/embed/${news.url.slice(17)}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <div className="support-footer">
      
        <div className='support-footer-card'>
          <div className='support-footer-card-block'>
            <Image src={'/support/coffee.webp'} width={40} height={40} alt='' />
          </div>
          <h2 className='text-center'>Будемо вдячні  за <br /> підтримку 😊</h2>
          <a href="https://buymeacoffee.com/yantarne.fm" target='_blank'>
            <button>Підтримати</button>
          </a>
         
        </div>
      </div>
    </main>
  )
}

export default Support

// 'use client'

// import React, { useRef, useState } from 'react'
// import './Support.scss'
// import Image from 'next/image'

// const Support = () => {
//   const videoRef = useRef(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [volume, setVolume] = useState(1)

//   const handleTogglePlay = () => {
//     if (!videoRef.current) return

//     if (isPlaying) {
//       videoRef.current.pause()
//       setIsPlaying(false)
//     } else {
//       videoRef.current.play()
//       setIsPlaying(true)
//     }
//   }

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value)
//     setVolume(newVolume)
//     if (videoRef.current) {
//       videoRef.current.volume = newVolume
//     }
//   }

//   return (
//     <main className='support'>
//       <h2 className='title'><span>П</span>ідтримати нас</h2>
//       <div className='line'></div>

//       <div className="video-container">
//         <video
//           ref={videoRef}
//           className='support-video'
//           muted={false}
//           loop
//         >
//           <source src="/support/Untitled.mp4" type="video/mp4" />
//         </video>

//         <button className="play-button" onClick={handleTogglePlay}>
//           <span className="play-icon">
//             {isPlaying ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="50"
//                 height="50"
//                 fill="white"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="50"
//                 height="50"
//                 fill="white"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M8 5v14l11-7z" />
//               </svg>
//             )}
//           </span>
//         </button>
//       </div>

//       <div className="volume-control">
//         <input
//           type="range"
//           min="0"
//           max="1"
//           step="0.05"
//           value={volume}
//           onChange={handleVolumeChange}
//         />
//       </div>

//       <div className="support-footer">
//         <div className='support-footer-card'>
//           <div className='support-footer-card-block'>
//             <Image src={'/support/coffee.webp'} width={40} height={40} alt='' />
//           </div>
//           <h2>Будемо вдячні 😊</h2>
//           <a href="https://buymeacoffee.com/yantarne.fm" target='_blank'>
//             <button>Підтримати</button>
//           </a>
//         </div>
//       </div>
//     </main>
//   )
// }

// export default Support
