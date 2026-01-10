'use client';
import React, { useEffect, useRef, useState } from 'react';
import './MiniPlayer.scss';
import usePlayerStore from '@/store/usePlayerStore';

const MiniPlayer = () => {
  const { 
    isPlaying, 
    trackInfo, 
    setAudioElement, 
    setTrackInfo, 
    togglePlay,
    initializeAudioContext
  } = usePlayerStore();

  const [isMounted, setIsMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef(null);
  const streamUrl = 'https://complex.in.ua/yantarne';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [isMounted, setAudioElement]);

  // Intercept play to ensure AudioContext is ready
  const handlePlayClick = async () => {
    initializeAudioContext();
    await togglePlay();
  };

  useEffect(() => {
    setAudioElement(audioRef.current);

    const visited = sessionStorage.getItem('hasVisited');
    if (visited) setVisible(true);
  }, [setAudioElement]);

  // Metadata fetching
  useEffect(() => {
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
  }, [setTrackInfo]);

  const fullTrackName = trackInfo.title 
    ? `${trackInfo.artist} - ${trackInfo.title}` 
    : 'Yantarne FM - Loading...';

  if (!isMounted) return null;

  return (
    <div className={`mini-player-wrapper ${visible ? '' : 'hidden'}`}>
      <audio 
        ref={audioRef} 
        src={streamUrl} 
        preload="none" 
        crossOrigin="anonymous" 
        onPlay={() => usePlayerStore.setState({ isPlaying: true })}
        onPause={() => usePlayerStore.setState({ isPlaying: false })}
      />

      <div className="mini-player-glass">
        <button 
          className="mp-btn" 
          onClick={handlePlayClick}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
               <rect x="6" y="4" width="4" height="16" rx="1" />
               <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
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
