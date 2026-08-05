import { create } from 'zustand';

const STREAM_URL = 'https://complex.in.ua/yantarne';
const MAX_RECONNECT_DELAY = 30000; // 30с — стеля backoff
const BASE_RECONNECT_DELAY = 1000; // старт з 1с
const STALL_TIMEOUT = 15000; // якщо 15с нема прогресу — вважаємо стрім мертвим

let reconnectTimer = null;
let stallTimer = null;
let reconnectAttempts = 0;

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
    if (prev) detachListeners(prev, get, set);
    if (el) {
      // ВАЖЛИВО: виставляти crossOrigin ДО src, якщо стрім на іншому домені
      // і сервер віддає CORS-заголовки. Якщо CORS не налаштований на сервері —
      // прибери цей рядок і не використовуй createMediaElementSource (п.1.2 аналізу).
      el.crossOrigin = 'anonymous';
      attachListeners(el, get, set);
    }
    set({ audioElement: el });
  },

  setAnalyser: (analyser) => set({ analyser }),
  setAudioContext: (ctx) => set({ audioContext: ctx }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setTrackInfo: (info) => set({ trackInfo: info }),

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

      // Автопробудження AudioContext, якщо він засне під час відтворення (п.1.3)
      audioCtx.onstatechange = () => {
        if (audioCtx.state === 'suspended' && get().isPlaying) {
          audioCtx.resume().catch((e) =>
            console.warn('Auto-resume AudioContext failed:', e)
          );
        }
      };

      set({ audioContext: audioCtx, analyser });
    } catch (err) {
      // Якщо стрім cross-origin без CORS — createMediaElementSource може кинути тут.
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
      audioElement.pause();
      set({ isPlaying: false, connectionStatus: 'idle' });
    } else {
      await startPlayback(get, set);
    }
  },
}));

async function startPlayback(get, set, { isReconnect = false } = {}) {
  const { audioElement, audioContext } = get();
  if (!audioElement) return;

  if (audioContext && audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (e) {
      console.error('AudioContext resume failed', e);
    }
  }

  set({ connectionStatus: isReconnect ? 'reconnecting' : 'connecting' });

  try {
    // cache-busting query — без нього браузер/проксі можуть повторно
    // "приліпитись" до того ж мертвого з'єднання при реконекті
    const url = `${STREAM_URL}${STREAM_URL.includes('?') ? '&' : '?'}_ts=${Date.now()}`;
    audioElement.src = url;
    audioElement.load();
    await audioElement.play();
    set({ isPlaying: true, connectionStatus: 'playing' });
    reconnectAttempts = 0;
    armStallTimer(get, set);
  } catch (err) {
    console.error('Playback failed:', err);
    set({ isPlaying: false, connectionStatus: 'error' });
    scheduleReconnect(get, set);
  }
}

function scheduleReconnect(get, set) {
  clearReconnect();
  const delay = Math.min(
    BASE_RECONNECT_DELAY * 2 ** reconnectAttempts,
    MAX_RECONNECT_DELAY
  );
  reconnectAttempts += 1;
  set({ connectionStatus: 'reconnecting' });
  reconnectTimer = setTimeout(() => {
    // Не намагатись перепідключатись, якщо юзер сам поставив на паузу
    if (!navigator.onLine) {
      // почекаємо події 'online' замість того щоб довбати мережу вхолосту
      return;
    }
    startPlayback(get, set, { isReconnect: true });
  }, delay);
}

function clearReconnect() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;
  if (stallTimer) clearTimeout(stallTimer);
  stallTimer = null;
}

function armStallTimer(get, set) {
  if (stallTimer) clearTimeout(stallTimer);
  stallTimer = setTimeout(() => {
    // Якщо за STALL_TIMEOUT не було прогресу відтворення — вважаємо стрім мертвим
    const { audioElement, isPlaying } = get();
    if (isPlaying && audioElement && audioElement.paused) {
      set({ connectionStatus: 'stalled' });
      scheduleReconnect(get, set);
    }
  }, STALL_TIMEOUT);
}

function attachListeners(el, get, set) {
  el._onError = () => {
    console.warn('Audio error:', el.error);
    set({ isPlaying: false, connectionStatus: 'error' });
    scheduleReconnect(get, set);
  };
  el._onStalled = () => {
    // 'stalled' = браузер намагався отримати дані, але не зміг (типово для розриву Icecast)
    set({ connectionStatus: 'stalled' });
    scheduleReconnect(get, set);
  };
  el._onWaiting = () => {
    // 'waiting' = буферизація; даємо шанс відновитись самостійно,
    // але страхуємось таймером на випадок, якщо буферизація ніколи не завершиться
    set({ connectionStatus: 'connecting' });
    armStallTimer(get, set);
  };
  el._onEnded = () => {
    // Для живого стріму 'ended' зазвичай означає, що сервер закрив з'єднання
    set({ isPlaying: false, connectionStatus: 'error' });
    scheduleReconnect(get, set);
  };
  el._onSuspend = () => {
    // 'suspend' часто нешкідливий (браузер призупинив завантаження, бо буфер повний),
    // логуємо для діагностики, але не реагуємо агресивно
    console.debug('Audio suspend event');
  };
  el._onPause = () => {
    // Native pause, ІНІЦІЙОВАНИЙ НЕ НАМИ (наприклад ОС/навушники/lock screen)
    // Якщо ми самі викликали pause() через togglePlay — isPlaying вже false,
    // і реконект не потрібен. Розрізняємо через прапорець намірного pause.
    if (get().isPlaying) {
      set({ connectionStatus: 'stalled' });
      scheduleReconnect(get, set);
    }
  };
  el._onPlaying = () => {
    set({ connectionStatus: 'playing' });
    reconnectAttempts = 0;
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

// Глобальні мережеві/видимість слухачі — вішаємо один раз при завантаженні модуля.
// SSR-safe перевірка для Next.js.
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
      const { audioContext, isPlaying } = usePlayerStore.getState();
      if (audioContext && audioContext.state === 'suspended' && isPlaying) {
        audioContext.resume().catch(() => {});
      }
    }
  });
}

export default usePlayerStore;
