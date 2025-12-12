'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import './Home.scss';

const Home = () => {
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [trackInfo, setTrackInfo] = useState({ title: '', artist: '' });
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafRef = useRef(null);

  const streamUrl = 'https://complex.in.ua/yantarne';

  // Preload background images
  useEffect(() => {
    if (!backgroundImages.length) return;

    let loadedCount = 0;
    backgroundImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === backgroundImages.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [backgroundImages]);

  // Background image rotation
  useEffect(() => {
    if (!imagesLoaded || backgroundImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % backgroundImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [imagesLoaded, backgroundImages]);

  // Set audio volume/mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Pause audio on mobile when page hidden
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handlePageHide = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  // Fetch track info
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
        console.warn('Track info error:', err);
      }
    };

    fetchTrackInfo();
    const interval = setInterval(fetchTrackInfo, 50000);
    return () => clearInterval(interval);
  }, []);

  // Setup AudioContext and visualizer
  useEffect(() => {
    const setup = () => {
      if (!audioRef.current) return;

      try {
        audioRef.current.crossOrigin = 'anonymous';
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const audioCtx = new AudioContext();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaElementSource(audioRef.current);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        startVisualizer();
      } catch (err) {
        console.warn('AudioContext/Analyser setup failed:', err);
      }
    };

    setup();

    return () => {
      stopVisualizer();
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  // Toggle play/pause
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaElementSource(audioRef.current);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        startVisualizer();
      } catch (e) {
        console.warn('Init audio context failed:', e);
      }
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        audioRef.current.load();
        await audioRef.current.play();

        setIsPlaying(true);
      } catch (err) {
        console.warn('Play failed:', err);
      }
    }
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  const onVolumeChange = e => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  const increase = () => setVolume(v => Math.min(100, v + 10));
  const decrease = () => setVolume(v => Math.max(0, v - 10));

  // Draw rounded rectangle for visualizer
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  function startVisualizer() {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      analyser.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, width, height);

      const bufferLength = analyser.frequencyBinCount;
      const barWidth = Math.max(2, width / bufferLength);
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 255;
        const barHeight = v * height;

        const grad = ctx.createLinearGradient(0, height - barHeight, 0, height);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,1)');
        ctx.fillStyle = grad;

        drawRoundedRect(ctx, x, height - barHeight, barWidth, barHeight, 0);
        x += barWidth + 10;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(render);
  }

  function stopVisualizer() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  // Resize canvas on window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth);
      canvas.height = Math.floor(canvas.getBoundingClientRect().height * dpr);
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
        setBackgroundImages(data?.backgroundImages?.length ? data.backgroundImages : ['/back.png']);
      } catch (err) {
        console.error('Failed to fetch background images:', err);
        setBackgroundImages(['/back.png']);
      }
    };
    fetchBackgroundImages();
  }, []);

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
      <audio ref={audioRef} src={streamUrl} preload="none" />

      <div className="overlay" />

      <div className="player-container">
        <div className="controls">
          <button onClick={togglePlay} className="border_btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
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
          <button className="vol-icon top" onClick={increase} aria-label="increase">
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

          <button className="vol-icon bottom" onClick={decrease} aria-label="decrease">
            <Image src="/volume2.webp" width={32} height={32} alt="volume down" />
          </button>

          <button className="mute-btn" onClick={toggleMute} aria-label="mute">
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

      <div className="visualizer-wrap">
        <canvas ref={canvasRef} className="visualizer-canvas" />
      </div>
    </main>
  );
};

export default Home;
