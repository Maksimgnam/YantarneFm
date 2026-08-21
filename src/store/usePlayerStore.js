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
// ЗАМІНИ шляхи на реальні іконки радіо у /public (бажано мінімум 2 розміри).
const MEDIA_ARTWORK = [
  { src: '/icon-96.png', sizes: '96x96', type: 'image/png' },
  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
];

let reconnectTimer = null;
let stallTimer = null;
let resyncCheckTimer = null;
let contextWatchdogTimer = null; // ДОДАНО
let reconnectAttempts = 0;
let mediaSessionInitialized = false; // ДОДАНО

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
      // ВАЖЛИВО: виставляти crossOrigin ДО src, якщо стрім на іншому домені
      // і сервер віддає CORS-заголовки. Якщо CORS не налаштований на сервері —
      // прибери цей рядок і не використовуй createMediaElementSource (п.1.2 аналізу).
      el.crossOrigin = 'anonymous';
      attachListeners(el, get, set);
    }
    set({ audioElement: el });
    setupMediaSession(get, set); // ДОДАНО: реєструємо play/pause на Lock Screen один раз
  },

  setAnalyser: (analyser) => set({ analyser }),
  setAudioContext: (ctx) => set({ audioContext: ctx }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  // ВИПРАВЛЕНО: оновлюємо ще й Media Session metadata (назва/артист/обкладинка
  // на Lock Screen мають синхронно змінюватись разом з треком)
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

      // Автопробудження AudioContext, якщо він засне під час відтворення (п.1.3).
      // Це вже було в оригіналі, але саме по собі НЕ рятує фонове відтворення на
      // iOS: поки сторінка у фоні, iOS може взагалі не виконувати JS на сторінці,
      // тож onstatechange може просто не встигнути спрацювати вчасно. Тому нижче
      // додано ще й активний watchdog (armContextWatchdog) + перевірку одразу
      // при поверненні у форграунд (recoverAfterForeground).
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
      clearResyncCheck();
      clearContextWatchdog(); // ДОДАНО
      audioElement.pause();
      set({ isPlaying: false, connectionStatus: 'idle' });
      setMediaSessionPlaybackState('paused'); // ДОДАНО
    } else {
      await startPlayback(get, set);
    }
  },
}));

// ДОДАНО: параметр silent — для тихого ресинку на live edge без блимання
// статусу "reconnecting" в UI
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
    // cache-busting query — без нього браузер/проксі можуть повторно
    // "приліпитись" до того ж мертвого з'єднання при реконекті
    const url = `${STREAM_URL}${STREAM_URL.includes('?') ? '&' : '?'}_ts=${Date.now()}`;
    audioElement.src = url;
    audioElement.load();
    await audioElement.play();
    set({ isPlaying: true, connectionStatus: 'playing' });
    setMediaSessionPlaybackState('playing'); // ДОДАНО
    reconnectAttempts = 0;
    armStallTimer(get, set);
    armResyncCheck(get, set);
    armContextWatchdog(get, set); // ДОДАНО
  } catch (err) {
    console.error('Playback failed:', err);
    if (!silent) {
      set({ isPlaying: false, connectionStatus: 'error' });
      setMediaSessionPlaybackState('paused'); // ДОДАНО
    }
    // ВИПРАВЛЕНО: раніше тут завжди викликалось scheduleReconnect(get, set) —
    // тобто навіть "тихий" виклик (з checkBufferDrift) міг у разі помилки
    // .play() вивалити видимий статус "reconnecting" в UI, хоча за задумом
    // (див. коментар у checkBufferDrift) цей ресинк мав лишатись непомітним.
    scheduleReconnect(get, set, silent);
  }
}

// ВИПРАВЛЕНО: додано параметр silent, який реально пробрасывается далі
// ВИПРАВЛЕНО (v2): поки сторінка у фоні — жодного src/load()-реконекту.
// Максимум — м'який повторний .play() на вже наявному елементі (без зміни
// ресурсу), що з набагато більшою ймовірністю дозволений браузером, бо це
// "продовження" вже дозволеної сесії, а не нова. Повноцінний реконект
// відбудеться при поверненні у форграунд через recoverAfterForeground.
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
    return; // жодного backoff/src-реконекту, поки сторінка схована
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
    // Не намагатись перепідключатись, якщо юзер сам поставив на паузу
    if (!navigator.onLine) {
      // почекаємо події 'online' замість того щоб довбати мережу вхолосту
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

// ДОДАНО (v2 — реальна причина швидкого й однакового на iOS/Android розриву):
// поки document.hidden === true, НІКОЛИ не можна чіпати audioElement.src /
// викликати .load(). Мобільні браузери трактують зміну src + повторний
// .play() як старт НОВОЇ медіа-сесії (а не продовження вже дозволеної) — і
// такий play(), ініційований скриптом (не прямим тапом користувача), поки
// сторінка згорнута/заблокована, ВІДХИЛЯЄТЬСЯ політикою автовідтворення.
// Саме це вбивало звук: періодичний checkBufferDrift (кожні 30с) чи
// watchdog у фоні намагались "тихо" перепідключитись через src+load(),
// отримували відмову браузера — і назавжди лишали audio мовчазним, поки
// isPlaying в сторі й далі показував true (кнопка "грає").
function isHidden() {
  return typeof document !== 'undefined' && document.hidden;
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

// ДОДАНО: watchdog, що активно опитує AudioContext, поки триває відтворення.
// Це не панацея (на iOS, поки сторінка у фоні, JS може взагалі не виконуватись,
// тож цей setInterval теж може "замерзнути" — див. recoverAfterForeground нижче
// як другу лінію захисту, яка спрацьовує гарантовано в момент повернення),
// але для Android Chrome і для коротких/часткових призупинень на iOS це реально
// відновлює звук без участі користувача.
function armContextWatchdog(get, set) {
  clearContextWatchdog();
  contextWatchdogTimer = setInterval(() => {
    const { audioContext, isPlaying, audioElement } = get();
    if (!isPlaying) return;

    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {
        // якщо resume() відхилено, поки сторінка у фоні — це очікувано,
        // наступна спроба буде за CONTEXT_WATCHDOG_INTERVAL або на поверненні
        // у форграунд
      });
    }

    // Захист від "тихого" стану: audio-елемент раптово на паузі, хоча ми
    // впевнені, що мали грати (наприклад ОС перервала сесію дзвінком/іншим
    // застосунком), а подія 'pause' з якоїсь причини не була оброблена.
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

// ДОДАНО: періодична перевірка "наскільки буфер випереджає точку відтворення".
function armResyncCheck(get, set) {
  clearResyncCheck();
  resyncCheckTimer = setInterval(() => checkBufferDrift(get, set), RESYNC_CHECK_INTERVAL);
}

function clearResyncCheck() {
  if (resyncCheckTimer) clearInterval(resyncCheckTimer);
  resyncCheckTimer = null;
}

function checkBufferDrift(get, set) {
  // ВИПРАВЛЕНО (v2): поки сторінка згорнута, ресинк буфера нікому не чутно
  // (екран заблокований) — а спроба його зробити якраз і була причиною
  // "мовчазного" зависання: src-реконект у фоні браузер відхиляє.
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

// ДОДАНО: Media Session API.
// Дає: (а) керування play/pause з Lock Screen / шторки сповіщень на iOS та
// Android; (б) сигнал ОС, що сторінка веде легітимну фонову медіа-сесію —
// це саме той механізм, за яким ОС вирішує, чи тримати аудіо живим у фоні,
// чи приспати його. Реєструємо обробники один раз — вони не залежать від
// конкретного audio-елемента.
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
      set({ isPlaying: false, connectionStatus: 'idle' });
      setMediaSessionPlaybackState('paused');
    }
  });

  navigator.mediaSession.setActionHandler('stop', () => {
    const { audioElement } = get();
    clearReconnect();
    clearResyncCheck();
    clearContextWatchdog();
    if (audioElement) audioElement.pause();
    set({ isPlaying: false, connectionStatus: 'idle' });
    setMediaSessionPlaybackState('none');
  });

  // Це живий ефір без перемотки/треків — явно вимикаємо ці екшени, інакше
  // iOS/Android можуть показати неактивні або оманливі кнопки
  ['seekbackward', 'seekforward', 'seekto', 'previoustrack', 'nexttrack'].forEach(
    (action) => {
      try {
        navigator.mediaSession.setActionHandler(action, null);
      } catch (e) {
        // не всі браузери підтримують усі екшени — ігноруємо
      }
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
  navigator.mediaSession.playbackState = state; // 'playing' | 'paused' | 'none'
}

// ДОДАНО: єдина точка "ремонту" стріму в момент повернення з фону.
// ЧОМУ ЦЕ ОКРЕМА ФУНКЦІЯ, А НЕ ЛИШЕ watchdog: поки Safari/Chrome тримає
// сторінку у фоні (заблокований екран, інший застосунок активний), рушій
// може взагалі не виконувати JS на сторінці — жоден setInterval чи
// audioCtx.onstatechange не гарантовано встигне спрацювати. Але
// visibilitychange/focus/pageshow ГАРАНТОВАНО спрацьовують у момент, коли
// користувач повертається — тож саме тут має бути "останній рубіж" перевірки.
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
    // ВИПРАВЛЕНО (v2): у фоні НЕ скидаємо isPlaying — інакше
    // recoverAfterForeground (який діє лише коли isPlaying === true) не
    // зможе полагодити стрім, коли користувач поверне сторінку.
    // connectionStatus теж не чіпаємо у фоні — все одно невидимо користувачу.
    if (isHidden()) {
      scheduleReconnect(get, set); // сам розбереться (м'який play() у фоні)
      return;
    }
    set({ isPlaying: false, connectionStatus: 'error' });
    scheduleReconnect(get, set);
  };
  el._onStalled = () => {
    // 'stalled' = браузер намагався отримати дані, але не зміг (типово для розриву Icecast)
    if (!isHidden()) set({ connectionStatus: 'stalled' });
    scheduleReconnect(get, set);
  };
  el._onWaiting = () => {
    // 'waiting' = буферизація; даємо шанс відновитись самостійно,
    // але страхуємось таймером на випадок, якщо буферизація ніколи не завершиться
    if (!isHidden()) set({ connectionStatus: 'connecting' });
    armStallTimer(get, set);
  };
  el._onEnded = () => {
    // Для живого стріму 'ended' зазвичай означає, що сервер закрив з'єднання
    // ВИПРАВЛЕНО (v2): та сама логіка — не скидаємо isPlaying у фоні
    if (isHidden()) {
      scheduleReconnect(get, set);
      return;
    }
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
    if (get().isPlaying) {
      set({ connectionStatus: 'stalled' });
      scheduleReconnect(get, set);
    }
  };
  el._onPlaying = () => {
    set({ connectionStatus: 'playing' });
    reconnectAttempts = 0;
    setMediaSessionPlaybackState('playing'); // ДОДАНО
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
      recoverAfterForeground(usePlayerStore.getState, usePlayerStore.setState); // ВИПРАВЛЕНО
    }
  });

  // ДОДАНО: додаткові точки повернення з фону. На iOS Safari 'focus' і
  // 'pageshow' іноді спрацьовують надійніше/раніше за visibilitychange,
  // особливо коли сторінка відновлюється з bfcache.
  window.addEventListener('focus', () => {
    recoverAfterForeground(usePlayerStore.getState, usePlayerStore.setState);
  });

  window.addEventListener('pageshow', () => {
    recoverAfterForeground(usePlayerStore.getState, usePlayerStore.setState);
  });
}

export default usePlayerStore;
