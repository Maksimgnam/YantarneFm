'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './Home.scss';
import usePlayerStore from '@/store/usePlayerStore';

const Home = () => {
  const { 
    isPlaying, 
    trackInfo, 
    volume, 
    isMuted, 
    analyser, 
    togglePlay, 
    setVolume, 
    setIsMuted,
    initializeAudioContext 
  } = usePlayerStore();

  const [backgroundImages, setBackgroundImages] = useState(['/back.webp']);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Refs for visualizer
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Background slider logic
  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [backgroundImages]);

  // Visualizer loop
  useEffect(() => {
    if (!analyser) return;

    // Initialize data array if needed (analyser.frequencyBinCount is usually 128 for fftSize 256)
    if (!dataArrayRef.current || dataArrayRef.current.length !== analyser.frequencyBinCount) {
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = dataArrayRef.current;

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);
      
      // Calculate bar width with spacing
      const spacing = 4;
      // Note: we're iterating over the whole bufferLength, so we need to account for spacing in total width
      const barWidth = Math.max(2, (width / bufferLength) - spacing);
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        const barHeight = v * height; 
        
        const grad = ctx.createLinearGradient(0, height - barHeight, 0, height);
        grad.addColorStop(0, 'rgba(255,255,255,0.8)');
        grad.addColorStop(1, 'rgba(255,255,255,0.2)');

        ctx.fillStyle = grad;
        
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + spacing;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
  
      const logicalWidth = window.innerWidth;
      const logicalHeight = window.innerHeight * 0.3;
  
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
  
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
  
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  

  // Fetch background images
  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/back-images`);
        const data = await res.json();
        if (data?.backgroundImages?.length) {
            setBackgroundImages(data.backgroundImages);
        }
      } catch (err) {
        console.error('Failed to fetch background images:', err);
      }
    };
    fetchBackgroundImages();
  }, []);

  const handlePlayClick = async () => {
    initializeAudioContext();
    await togglePlay();
  };

  const handleMuteToggle = () => setIsMuted(!isMuted);

  const onVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  const increaseVolume = () => setVolume(Math.min(100, volume + 10));
  const decreaseVolume = () => setVolume(Math.max(0, volume - 10)); // Unused in original but useful

  return (
    <main
      className="home"
      style={{
        backgroundImage: `url(${backgroundImages[currentIndex] || '/back.webp'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      {/* Visualizer Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '30vh',
          zIndex: 1,
          pointerEvents: 'none',

        }}
      />

      <div className="overlay" />

      <div className="player-container">
        <div className="controls">
          <button onClick={handlePlayClick} className="border_btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
            <div className="grey_btn">
              <div className={isPlaying ? 'play-btn playing' : 'play-btn'}>
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="#fff">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>

        <div className="track-info">
          <h2 className="title">{trackInfo.title || 'YantarneFM'}</h2>
          <h3 className="artist">{trackInfo.artist || 'Радіо рідного міста'}</h3>
        </div>

        <div className="volume-vertical">
          <button className="vol-icon top" onClick={increaseVolume} aria-label="increase">
            <Image src="/volume1.webp" width={32} height={32} alt="volume up" />
          </button>

          <div className="vol-slider-container">
            <input
              className="vol-range"
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              orient="vertical"
            />
          </div>

          <button className="vol-icon bottom" onClick={decreaseVolume} aria-label="decrease">
            <Image src="/volume2.webp" width={32} height={32} alt="volume down" />
          </button>

          <button className="mute-btn" onClick={handleMuteToggle} aria-label="mute">
            {isMuted || volume === 0 ? (
              <div className="mute-ind">
                <Image src="/Volume_Off.svg" width={28} height={28} alt="volume mute" />
              </div>
            ) : (
              <div className="mute-ind">
                <Image src="/Volume_Max.svg" width={25} height={25} alt="volume on" />
              </div>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
