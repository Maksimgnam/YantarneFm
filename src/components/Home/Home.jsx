'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import './Home.scss'

const Home = () => {
  const [volume, setVolume] = useState(50)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [trackInfo, setTrackInfo] = useState({ title: '', artist: '' })

  const audioRef = useRef(null)
  const canvasRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  const rafRef = useRef(null)

  const streamUrl = 'https://complex.in.ua/yantarne' // твій стрім

  // Зміна гучності
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])


  useEffect(() => {
    const fetchTrackInfo = async () => {
      try {
        const res = await fetch('https://complex.in.ua/status-json.xsl?mount=/yantarne')
        const data = await res.json()
        const rawTitle = data?.icestats?.source?.title || ''
        const parts = rawTitle.split(' - ')
        const artist = parts[0] ?? ''
        const title = parts.slice(1).join(' - ') ?? rawTitle
        setTrackInfo({ title, artist })
      } catch (err) {
        console.warn('Track info error:', err)
      }
    }

    fetchTrackInfo()
    const interval = setInterval(fetchTrackInfo, 50000)
    return () => clearInterval(interval)
  }, [])

  // Підключення WebAudio + Analyser
  useEffect(() => {
    const setup = () => {
      if (!audioRef.current) return
      try {
        // щоб мати доступ до частот — потрібен crossOrigin
        audioRef.current.crossOrigin = 'anonymous'

        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) return

        const audioCtx = new AudioContext()
        audioContextRef.current = audioCtx

        // джерело з <audio>
        const source = audioCtx.createMediaElementSource(audioRef.current)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 256
        analyserRef.current = analyser

        source.connect(analyser)
        analyser.connect(audioCtx.destination)

        const bufferLength = analyser.frequencyBinCount
        dataArrayRef.current = new Uint8Array(bufferLength)

        startVisualizer()
      } catch (err) {
        console.warn('AudioContext/Analyser setup failed:', err)
      }
    }

    setup()

    return () => {
      stopVisualizer()
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close()
        } catch (e) {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // лише один раз на mount

  // Запуск/зупинка плеєра
  const togglePlay = async () => {
    if (!audioRef.current) return
    if (!audioContextRef.current) {
      // деякі браузери вимагають user gesture, тож ініціалізуємо контекст тут якщо потрібно
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        const audioCtx = new AudioContext()
        audioContextRef.current = audioCtx
        const source = audioCtx.createMediaElementSource(audioRef.current)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 256
        analyserRef.current = analyser
        source.connect(analyser)
        analyser.connect(audioCtx.destination)
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount)
        startVisualizer()
      } catch (e) {
        console.warn('Init audio context failed:', e)
      }
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      // resume audio context (для автоплей політик)
      try {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume()
        }
      } catch (e) {}
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (err) {
        console.warn('Play failed:', err)
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  const onVolumeChange = (e) => {
    const val = Number(e.target.value)
    setVolume(val)
    if (val === 0) setIsMuted(true)
    else setIsMuted(false)
  }

  const increase = () => setVolume(v => Math.min(100, v + 10))
  const decrease = () => setVolume(v => Math.max(0, v - 10))

  // Функція для малювання прямокутника з заокругленими кутами
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()
  }

  // Візуалізатор
  function startVisualizer() {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return
    const ctx = canvas.getContext('2d')

    const render = () => {
      const width = canvas.width
      const height = canvas.height
      analyser.getByteFrequencyData(dataArrayRef.current)

      ctx.clearRect(0, 0, width, height)

      const bufferLength = analyser.frequencyBinCount
      const barWidth = Math.max(2, (width / bufferLength) * 1)
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 255
        const barHeight = v * height

        // Градієнт для паличок
        const grad = ctx.createLinearGradient(0, height - barHeight, 0, height)
        grad.addColorStop(0, 'rgba(255,255,255,1)')
        grad.addColorStop(1, 'rgba(255,255,255,1)')
        ctx.fillStyle = grad

        // Малюємо заокруглені палички
        drawRoundedRect(ctx, x, height - barHeight, barWidth, barHeight, 0) // радіус 4px

        x += barWidth + 10 // невеликий відступ між паличками
      }

      rafRef.current = requestAnimationFrame(render)
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(render)
  }

  function stopVisualizer() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }

  // Масштабування canvas під DPR
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth)
      canvas.height = Math.floor(canvas.getBoundingClientRect().height * dpr)
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <main className='home'>
      <audio ref={audioRef} src={streamUrl} preload='none' />

      <div className='overlay' />

      <div className='player-container'>
        {/* Play button on the left */}
        <div className='controls'>
          <button
            onClick={togglePlay}
            className='border_btn'
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <div className='grey_btn'>
          <div
            className={isPlaying ? "play-btn playing" : 'play-btn'}            
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="#fff">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#fff">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
          </div>
          </button>
        </div>
        
        {/* Track info in the center */}
        <div className='track-info'>
          <h2 className='title'>{trackInfo.title || 'Dancin Krono Remix' }</h2>
          <h3 className='artist'>{trackInfo.artist || 'Aaron Smith feat. Luvli'}</h3>
          
          {/* Like button below track info */}
          <button className='heart-btn' title='Like'>
            <Image src='/heart.webp' width={32} height={32} alt='heart' />
          </button>
        </div>

        {/* Volume slider on the right */}
        <div className='volume-vertical'>
          <button className='vol-icon top' onClick={increase} aria-label='increase'>
            <Image src='/volume1.webp' width={32} height={32} alt='volume up' />

          </button>

          <div className='vol-slider-container'>
            <input
              className='vol-range'
              type='range'
              min='0'
              max='100'
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              orient='vertical'
            />
          </div>

          <button className='vol-icon bottom' onClick={decrease} aria-label='decrease'>
            <Image src='/volume2.webp' width={32} height={32} alt='volume down' />
          </button>

          <button className='mute-btn' onClick={toggleMute} aria-label='mute'>
            {isMuted || volume === 0 ? (
              <div className='mute-ind'>
                <Image src='/Volume_Off.svg' width={32} height={32} alt='volume mute' />
              </div>
            ) : (
              <div className='mute-ind'>
                <Image src='/Volume_Max.svg' width={32} height={32} alt='volume turn on' />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Visualizer at the bottom */}
      <div className='visualizer-wrap'>
        <canvas ref={canvasRef} className='visualizer-canvas' />
      </div>
    </main>
  )
}

export default Home
