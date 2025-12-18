'use client';
import React, { useState, useEffect, useRef } from 'react';
import './MiniPlayer.scss';

const MiniPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackInfo, setTrackInfo] = useState({ title: '', artist: '' });
  const [isMounted, setIsMounted] = useState(false);
  
  const audioRef = useRef(null);
  const streamUrl = 'https://complex.in.ua/yantarne';

  useEffect(() => {
    setIsMounted(true);
    
    const fetchTrackInfo = async () => {
      try {
        const res = await fetch('https://complex.in.ua/status-json.xsl?mount=/yantarne');
        const data = await res.json();
        const rawTitle = data?.icestats?.source?.title || '';
        
        const parts = rawTitle.split(' - ');
        const artist = parts[0] ?? '';
        const title = parts.slice(1).join(' - ') || rawTitle;
        
        setTrackInfo({ title, artist });
      } catch (err) {
        console.warn('Metadata error:', err);
      }
    };

    fetchTrackInfo();
    const interval = setInterval(fetchTrackInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        if (audio.src !== streamUrl) {
            audio.src = streamUrl;
            audio.load();
        }
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback failed:', err);
      }
    }
  };

  const fullTrackName = trackInfo.title 
    ? `${trackInfo.artist} - ${trackInfo.title}` 
    : 'Yantarne FM - Loading...';

  if (!isMounted) return null;

  return (
    <div className="mini-player-wrapper">
      <audio ref={audioRef} src={streamUrl} preload="none" crossOrigin="anonymous" />

      <div className="mini-player-glass">
        <button 
          className="mp-btn" 
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            // PAUSE ICON (Рівна сама по собі)
            <svg viewBox="0 0 24 24" fill="currentColor">
               <rect x="6" y="4" width="4" height="16" rx="1" />
               <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            // PLAY ICON (Додано клас play-icon для вирівнювання)
            <svg viewBox="0 0 24 24" fill="currentColor" className="play-icon">
               <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="mp-track-info">
          <div className="mp-marquee">
             <div className="mp-marquee-content">
               <span>{fullTrackName}</span>
               <span className="spacer">//</span>
               <span>{fullTrackName}</span>
               <span className="spacer">//</span>
             </div>
          </div>
        </div>

        <div className={`mp-bars ${isPlaying ? 'animating' : ''}`}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;