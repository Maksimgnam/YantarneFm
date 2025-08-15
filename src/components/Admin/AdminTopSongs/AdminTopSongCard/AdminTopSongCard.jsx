// 'use client';
// import React, { useState, useRef } from 'react';
// import './AdminTopSongCard.scss';
// import { useStore } from '@/store/store';

// const AdminTopSongCard = ({ title, artist, image, audio, id, index }) => {
//   const { openTopSongPopup } = useStore();
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(null);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <div className='admin-topsong-card'>
//       <div className='flex items-center'>
//         <h2>{index}</h2>
//         <img src={image} alt={title} />
//         <p>{artist} — {title}</p>
//       </div>
//       <input type="range" className='volume-control' />
//       <div className='flex items-center'>
//         <button className='play' onClick={togglePlay}>
//           {isPlaying ? (
//             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" className='rounded' viewBox="0 0 24 24" fill="#CC0100">
//               <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
//             </svg>
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="#CC0100">
//               <path d="M8 5v14l11-7z"/>
//             </svg>
//           )}
//         </button>
//         <button className='edit' onClick={() => openTopSongPopup(id, index)}>
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='pl-1' width="30" height="30">
//             <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M3 21l3-1 11-11a3 3 0 0 0-4-4L2 16v5z"/>
//               <path d="M14 7l3 3"/>
//             </g>
//           </svg>
//         </button>
//       </div>
//       <audio ref={audioRef} src={audio} />
//     </div>
//   );
// };

// export default AdminTopSongCard;
'use client';
import React, { useState, useRef, useEffect } from 'react';
import './AdminTopSongCard.scss';
import { useStore } from '@/store/store';

const AdminTopSongCard = ({ title, artist, image, audio, id, index }) => {
  const { openTopSongPopup } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Track progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.pause();
    };
  }, []);

  // Seek song
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className='admin-topsong-card'>
      <div className='flex items-center'>
        <h2>{index}</h2>
        <img src={image} alt={title} />
        <p>{artist} — {title}</p>
      </div>


      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.01"
        value={currentTime}
        onChange={handleSeek}
        className='progress-bar'
      />




      <div className='flex items-center'>
        <button className='play' onClick={togglePlay}>
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className='rounded' viewBox="0 0 24 24" fill="#CC0100">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#CC0100">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button className='edit' onClick={() => openTopSongPopup(id, index)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='pl-1' width="30" height="30">
            <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l3-1 11-11a3 3 0 0 0-4-4L2 16v5z"/>
              <path d="M14 7l3 3"/>
            </g>
          </svg>
        </button>
      </div>

      <audio ref={audioRef} src={audio} />
    </div>
  );
};

export default AdminTopSongCard;
