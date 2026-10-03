import { create } from 'zustand';

const STREAM_URL = 'https://complex.in.ua/yantarne';
const MAX_RECONNECT_DELAY = 30000; // 30с — стеля backoff
const BASE_RECONNECT_DELAY = 1000; // старт з 1с
const STALL_TIMEOUT = 15000; // якщо 15с нема прогресу — вважаємо стрім мертвим

// ДОДАНО: захист від "накопичення" буфера (buffer drift).
const BUFFER_DRIFT_THRESHOLD = 12; // сек — якщо буфер випереджає більше — ресинк
const RESYNC_CHECK_INTERVAL = 30000; // перевіряти кожні 30с під час відтворення

// ДОДАНО: watchdog для AudioContext.
// ПРИЧИНА ФІКСУ: createMediaElementSource() у initializeAudioContext() "захоплює"
// вихід <audio> цілком у граф Web Audio API. Коли iOS Safari / Android Chrome
// приспить AudioContext у фоні (блокування екрана, згортання застосунку) —
// звук зникає, хоча audioElement.paused лишається false і жодна з подій
// (pause/stalled/waiting/ended) не спрацьовує. Тому стан AudioContext треба
// опитувати активно, а не покладатись лише на audio-events.
const CONTEXT_WATCHDOG_INTERVAL = 5000; // перевіряти кожні 5с, поки isPlaying

// ДОДАНО: артворк для Lock Screen / notification panel.
const MEDIA_ARTWORK = [
  { src: '/logo.webp', sizes: '512x512', type: 'image/webp' },
];

let reconnectTimer = null;
let stallTimer = null;
let resyncCheckTimer = null;
let contextWatchdogTimer = null;
let reconnectAttempts = 0;
let mediaSessionInitialized = false;

const usePlayerStore = create((set, get) => ({
  isPlaying: false,
  // 'idle' | 'connecting' | 'playing' | 'stalled' | 'reconnecting' | 'error'
  connectionStatus: 'idle',
  volume: 100,
  isMuted: false,
  trackInfo: { title: 'Yantarne FM', artist: 'Loading...' },
  audioElement: null,
  analyser: null,
  audioContext: null,

  setAudioElement: (el) => {
    const prev = get().audioElement;
    if (prev) detachListeners(prev);
    if (el) {
      el.crossOrigin = 'anonymous';
      const { volume, isMuted } = get();
      el.volume = isMuted ? 0 : volume / 100;
      attachListeners(el, get, set);
    }
    set({ audioElement: el });
    setupMediaSession(get, set);
  },

  setAnalyser: (analyser) => set({ analyser }),
  setAudioContext: (ctx) => set({ audioContext: ctx }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setTrackInfo: (info) => {
    set({ trackInfo: info });
    updateMediaSessionMetadata(info);
  },

  setVolume: (volume) => {
    set({ volume });
    const { audioElement, isMuted } = get();
    if (audioElement) audioElement.volume = isMuted ? 0 : volume / 100;
  },

  setIsMuted: (isMuted) => {
    set({ isMuted });
    const { audioElement, volume } = get();
    if (audioElement) audioElement.volume = isMuted ? 0 : volume / 100;
  },

  initializeAudioContext: () => {
    const { audioElement, audioContext } = get();
    if (!audioElement || audioContext) return;

    try {
      const AudioContextCls = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCls) return;

      const audioCtx = new AudioContextCls();
      const source = audioCtx.createMediaElementSource(audioElement);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;

      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      audioCtx.onstatechange = () => {
        if (audioCtx.state === 'suspended' && get().isPlaying) {
          audioCtx.resume().catch((e) =>
            console.warn('Auto-resume AudioContext failed:', e)
          );
        }
      };

      set({ audioContext: audioCtx, analyser });
    } catch (err) {
      console.warn('AudioContext setup failed (можливо CORS, див. п.1.2):', err);
    }
  },

  togglePlay: async () => {
    const { isPlaying, audioElement } = get();
    if (!audioElement) {
      console.error('No audio element found in store');
      return;
    }

    if (isPlaying) {
      clearReconnect();
      clearResyncCheck();
      clearContextWatchdog();
      audioElement.pause();
      audioElement.src = '';
      set({ isPlaying: false, connectionStatus: 'idle' });
      setMediaSessionPlaybackState('paused');
    } else {
      await startPlayback(get, set);
    }
  },
}));

async function startPlayback(get, set, { isReconnect = false, silent = false } = {}) {
  const { audioElement, audioContext } = get();
  if (!audioElement) return;

  if (audioContext && audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (e) {
      console.error('AudioContext resume failed', e);
    }
  }

  if (!silent) {
    set({ connectionStatus: isReconnect ? 'reconnecting' : 'connecting' });
  }

  try {
    const url = `${STREAM_URL}${STREAM_URL.includes('?') ? '&' : '?'}_ts=${Date.now()}`;
    audioElement.src = url;
    audioElement.load();
    await audioElement.play();
    set({ isPlaying: true, connectionStatus: 'playing' });
    setMediaSessionPlaybackState('playing');
    reconnectAttempts = 0;
    armStallTimer(get, set);
    armResyncCheck(get, set);
    armContextWatchdog(get, set);
  } catch (err) {
    console.error('Playback failed:', err);
    if (!silent) {
      set({ isPlaying: false, connectionStatus: 'error' });
      setMediaSessionPlaybackState('paused');
    }
    scheduleReconnect(get, set, silent);
  }
}

function scheduleReconnect(get, set, silent = false) {
  clearReconnect();

  if (isHidden()) {
    const { audioElement } = get();
    if (audioElement && audioElement.paused) {
      audioElement.play().catch(() => {
        // не вдалось — це очікувано у фоні; довершимо відновлення на
        // recoverAfterForeground, коли користувач поверне сторінку
      });
    }
    return;
  }

  const delay = Math.min(
    BASE_RECONNECT_DELAY * 2 ** reconnectAttempts,
    MAX_RECONNECT_DELAY
  );
  reconnectAttempts += 1;
  if (!silent) {
    set({ connectionStatus: 'reconnecting' });
  }
  reconnectTimer = setTimeout(() => {
    if (!navigator.onLine) {
      return;
    }
    startPlayback(get, set, { isReconnect: true, silent });
  }, delay);
}

function clearReconnect() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;
  if (stallTimer) clearTimeout(stallTimer);
  stallTimer = null;
}

function isHidden() {
  return typeof document !== 'undefined' && document.hidden;
}

function armStallTimer(get, set) {
  if (stallTimer) clearTimeout(stallTimer);
  stallTimer = setTimeout(() => {
    const { audioElement, isPlaying } = get();
    if (isPlaying && audioElement && audioElement.paused) {
      set({ connectionStatus: 'stalled' });
      scheduleReconnect(get, set);
    }
  }, STALL_TIMEOUT);
}

function armContextWatchdog(get, set) {
  clearContextWatchdog();
  contextWatchdogTimer = setInterval(() => {
    const { audioContext, isPlaying, audioElement } = get();
    if (!isPlaying) return;

    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    if (audioElement && audioElement.paused) {
      set({ connectionStatus: 'stalled' });
      scheduleReconnect(get, set);
    }
  }, CONTEXT_WATCHDOG_INTERVAL);
}

function clearContextWatchdog() {
  if (contextWatchdogTimer) clearInterval(contextWatchdogTimer);
  contextWatchdogTimer = null;
}

function armResyncCheck(get, set) {
  clearResyncCheck();
  resyncCheckTimer = setInterval(() => checkBufferDrift(get, set), RESYNC_CHECK_INTERVAL);
}

function clearResyncCheck() {
  if (resyncCheckTimer) clearInterval(resyncCheckTimer);
  resyncCheckTimer = null;
}

function checkBufferDrift(get, set) {
  if (isHidden()) return;

  const { audioElement, isPlaying } = get();
  if (!audioElement || !isPlaying || audioElement.paused) return;

  const buffered = audioElement.buffered;
  if (!buffered || buffered.length === 0) return;

  const bufferedEnd = buffered.end(buffered.length - 1);
  const aheadSeconds = bufferedEnd - audioElement.currentTime;

  if (aheadSeconds > BUFFER_DRIFT_THRESHOLD) {
    console.info(
      `[stream] Буфер випереджає на ${aheadSeconds.toFixed(1)}с (ціль ≤${BUFFER_DRIFT_THRESHOLD}с) — тихий ресинк на live edge`
    );
    startPlayback(get, set, { isReconnect: true, silent: true });
  }
}

function setupMediaSession(get, set) {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  if (mediaSessionInitialized) return;
  mediaSessionInitialized = true;

  navigator.mediaSession.setActionHandler('play', () => {
    if (!get().isPlaying) startPlayback(get, set);
  });

  navigator.mediaSession.setActionHandler('pause', () => {
    const { audioElement, isPlaying } = get();
    if (isPlaying && audioElement) {
      clearReconnect();
      clearResyncCheck();
      clearContextWatchdog();
      audioElement.pause();
      audioElement.src = '';
      set({ isPlaying: false, connectionStatus: 'idle' });
      setMediaSessionPlaybackState('paused');
    }
  });

  navigator.mediaSession.setActionHandler('stop', () => {
    const { audioElement } = get();
    clearReconnect();
    clearResyncCheck();
    clearContextWatchdog();
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    set({ isPlaying: false, connectionStatus: 'idle' });
    setMediaSessionPlaybackState('none');
  });

  ['seekbackward', 'seekforward', 'seekto', 'previoustrack', 'nexttrack'].forEach(
    (action) => {
      try {
        navigator.mediaSession.setActionHandler(action, null);
      } catch (e) {}
    }
  );
}

function updateMediaSessionMetadata(trackInfo) {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: trackInfo?.title || 'Yantarne FM',
      artist: trackInfo?.artist || 'Радіо рідного міста',
      album: 'Yantarne FM · Live',
      artwork: MEDIA_ARTWORK,
    });
  } catch (e) {
    console.warn('MediaSession metadata failed:', e);
  }
}

function setMediaSessionPlaybackState(state) {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  navigator.mediaSession.playbackState = state;
}

function recoverAfterForeground(get, set) {
  const { audioContext, isPlaying, audioElement } = get();
  if (!isPlaying) return;

  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch((e) =>
      console.warn('Resume on foreground failed:', e)
    );
  }

  if (audioElement && audioElement.paused) {
    startPlayback(get, set, { isReconnect: true });
  }
}

function attachListeners(el, get, set) {
  el._onError = () => {
    console.warn('Audio error:', el.error);
    if (isHidden()) {
      scheduleReconnect(get, set);
      return;
    }
    set({ isPlaying: false, connectionStatus: 'error' });
    scheduleReconnect(get, set);
  };
  el._onStalled = () => {
    if (!isHidden()) set({ connectionStatus: 'stalled' });
    scheduleReconnect(get, set);
  };
  el._onWaiting = () => {
    if (!isHidden()) set({ connectionStatus: 'connecting' });
    armStallTimer(get, set);
  };
  el._onEnded = () => {
    if (isHidden()) {
      scheduleReconnect(get, set);
      return;
    }
    set({ isPlaying: false, connectionStatus: 'error' });
    scheduleReconnect(get, set);
  };
  el._onSuspend = () => {
    console.debug('Audio suspend event');
  };
  el._onPause = () => {
    if (get().isPlaying) {
      set({ connectionStatus: 'stalled' });
      scheduleReconnect(get, set);
    }
  };
  el._onPlaying = () => {
    set({ connectionStatus: 'playing' });
    reconnectAttempts = 0;
    setMediaSessionPlaybackState('playing');
  };

  el.addEventListener('error', el._onError);
  el.addEventListener('stalled', el._onStalled);
  el.addEventListener('waiting', el._onWaiting);
  el.addEventListener('ended', el._onEnded);
  el.addEventListener('suspend', el._onSuspend);
  el.addEventListener('pause', el._onPause);
  el.addEventListener('playing', el._onPlaying);
}

function detachListeners(el) {
  el.removeEventListener('error', el._onError);
  el.removeEventListener('stalled', el._onStalled);
  el.removeEventListener('waiting', el._onWaiting);
  el.removeEventListener('ended', el._onEnded);
  el.removeEventListener('suspend', el._onSuspend);
  el.removeEventListener('pause', el._onPause);
  el.removeEventListener('playing', el._onPlaying);
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const { isPlaying, connectionStatus } = usePlayerStore.getState();
    if (isPlaying || connectionStatus === 'reconnecting' || connectionStatus === 'error') {
      startPlayback(usePlayerStore.getState, usePlayerStore.setState, {
        isReconnect: true,
      });
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      recoverAfterForeground(usePlayerStore.getState, usePlayerStore.setState);
    }
  });

  window.addEventListener('focus', () => {
    recoverAfterForeground(usePlayerStore.getState, usePlayerStore.setState);
  });

  window.addEventListener('pageshow', () => {
    recoverAfterForeground(usePlayerStore.getState, usePlayerStore.setState);
  });
}

export default usePlayerStore;
