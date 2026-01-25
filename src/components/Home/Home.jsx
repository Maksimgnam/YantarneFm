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
      
      // 1. НАЛАШТУВАННЯ КОЛЬОРУ (НЕ ПРОЗОРИЙ)
      ctx.fillStyle = '#FFFFFF'; // Суцільний білий колір

      // 2. ОБРІЗКА ПОРОЖНІХ ЧАСТОТ
      // Високі частоти (останні ~25-30%) часто пусті. Ми беремо тільки перші 70%,
      // щоб візуалізація виглядала "повною" до самого краю екрана.
      const usefulBufferLength = Math.floor(bufferLength * 0.70);
      
      const spacing = 4; // Відступ між стовпчиками
      // Розтягуємо usefulBufferLength на всю ширину (width)
      const slotWidth = width / usefulBufferLength; 

      for (let i = 0; i < usefulBufferLength; i++) {
        // Нормалізація висоти (0..255 -> 0..height)
        const v = dataArray[i] / 255;
        const barHeight = v * height; 
        
        // Розрахунок позиції
        const x = i * slotWidth;
        
        // Ширина стовпчика (slotWidth мінус відступ)
        // Math.max(2, ...) гарантує, що стовпчик не зникне
        const barWidth = Math.max(2, slotWidth - spacing);

        // Малюємо
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser]);

  // Resize logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      
      // Використовуємо window.innerWidth для точної ширини вікна
      const logicalWidth = window.innerWidth;
      const logicalHeight = window.innerHeight * 0.35; // Трохи збільшив висоту (35% екрану)
  
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      
      // Стилі для коректного відображення на екрані
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
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
  const decreaseVolume = () => setVolume(Math.max(0, volume - 10));

  return (
    <main
      className="home"
      style={{
        backgroundImage: `url(${backgroundImages[currentIndex] || '/back.webp'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
        position: 'relative', // Важливо для абсолютного позиціонування всередині
        overflow: 'hidden'    // Щоб нічого не вилазило
      }}
    >
      {/* Visualizer Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: 'none',
          // Розміри контролюються через JS (resize ефект), 
          // але тут задаємо базові для надійності
          width: '100vw', 
          height: '35vh' 
        }}
      />

      <div className="overlay" />

      <div className="player-container" style={{ zIndex: 10 }}> 
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