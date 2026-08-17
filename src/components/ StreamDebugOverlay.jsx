'use client';
import React, { useEffect, useRef, useState } from 'react';
import usePlayerStore from '@/store/usePlayerStore';

const StreamDebugOverlay = () => {
  const { audioElement, isPlaying, connectionStatus } = usePlayerStore();
  const [aheadSeconds, setAheadSeconds] = useState(null);
  const [history, setHistory] = useState([]);
  const [startupMs, setStartupMs] = useState(null);
  const enabledRef = useRef(false);
  const clickTimeRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    enabledRef.current = params.get('debug') === 'stream';
  }, []);

  // ДОДАНО: заміряємо реальний час "розгону" — від моменту, коли ми
  // технічно почали спробу play() (isPlaying стає true в сторі), до моменту,
  // коли браузер справді видав перший звук (подія 'playing' на audioElement).
  // Це і є той самий стартовий буфер, який визначає фіксований офсет від ефіру.
  useEffect(() => {
    if (!enabledRef.current || !audioElement) return;
    clickTimeRef.current = performance.now();

    const onPlaying = () => {
      if (clickTimeRef.current !== null) {
        setStartupMs(performance.now() - clickTimeRef.current);
        clickTimeRef.current = null;
      }
    };
    audioElement.addEventListener('playing', onPlaying);
    return () => audioElement.removeEventListener('playing', onPlaying);
  }, [audioElement, isPlaying]);

  useEffect(() => {
    if (!enabledRef.current || !audioElement) return;

    const interval = setInterval(() => {
      const buffered = audioElement.buffered;
      if (!buffered || buffered.length === 0) return;

      const bufferedEnd = buffered.end(buffered.length - 1);
      const ahead = bufferedEnd - audioElement.currentTime;
      setAheadSeconds(ahead);
      setHistory((prev) => [...prev.slice(-29), ahead]); // тримаємо останні 30 замірів
    }, 2000);

    return () => clearInterval(interval);
  }, [audioElement]);

  if (!enabledRef.current) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 12,
        padding: '10px 14px',
        borderRadius: 8,
        minWidth: 220,
        lineHeight: 1.6,
      }}
    >
      <div>status: {connectionStatus}</div>
      <div>playing: {String(isPlaying)}</div>
      <div>
        buffer ahead: {aheadSeconds !== null ? `${aheadSeconds.toFixed(1)}s` : '—'}
      </div>
      <div>
        час до звуку: {startupMs !== null ? `${(startupMs / 1000).toFixed(2)}s` : '—'}
      </div>
      <div style={{ opacity: 0.6, fontSize: 10, marginTop: 4 }}>
        останні: {history.map((v) => v.toFixed(0)).join(', ')}
      </div>
    </div>
  );
};

export default StreamDebugOverlay;