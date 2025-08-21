'use client';
import React, { useState, useRef, useEffect } from 'react';
import './TopSongCard.scss';
import { useStore } from '@/store/store';

let currentlyPlayingAudio = null;
let currentlyPlayingSetPlaying = null;

const TopSongCard = ({ title, artist, image, audio, id, index }) => {
  const { openTopSongPopup } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (currentlyPlayingAudio && currentlyPlayingAudio !== audioRef.current) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio.currentTime = 0;
      if (currentlyPlayingSetPlaying) currentlyPlayingSetPlaying(false); 
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      currentlyPlayingAudio = null;
      currentlyPlayingSetPlaying = null;
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      currentlyPlayingAudio = audioRef.current;
      currentlyPlayingSetPlaying = setIsPlaying;
    }
  };

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);       
      setCurrentTime(0);       
      currentlyPlayingAudio = null;
      currentlyPlayingSetPlaying = null;
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className='admin-topsong-card'>
      <div className='flex items-center'>
        <h2>{index}</h2>
        <img src={image} alt={title} />
        <p>{artist} — {title}</p>
      </div>

    

      <div className='button-container'>
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.01"
        value={currentTime}
        onChange={handleSeek}
        className='progress-bar'
      />
        <button className='play' onClick={togglePlay}>
          {isPlaying ? (
            // Pause icon
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className='rounded' viewBox="0 0 24 24" fill="#CC0100">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            // Play triangle
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#CC0100">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>


      </div>

      <audio ref={audioRef} src={audio} />
    </div>
  );
};

export default TopSongCard;
