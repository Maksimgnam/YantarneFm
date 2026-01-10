import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  isPlaying: false,
  volume: 100,
  isMuted: false,
  trackInfo: { title: 'Yantarne FM', artist: 'Loading...' },
  audioElement: null,
  analyser: null,
  audioContext: null,

  setAudioElement: (el) => set({ audioElement: el }),
  setAnalyser: (analyser) => set({ analyser }),
  setAudioContext: (ctx) => set({ audioContext: ctx }),
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  setVolume: (volume) => {
    set({ volume });
    const { audioElement, isMuted } = get();
    if (audioElement) {
      audioElement.volume = isMuted ? 0 : volume / 100;
    }
  },
  
  setIsMuted: (isMuted) => {
    set({ isMuted });
    const { audioElement, volume } = get();
    if (audioElement) {
      audioElement.volume = isMuted ? 0 : volume / 100;
    }
  },
  
  setTrackInfo: (info) => set({ trackInfo: info }),

  initializeAudioContext: () => {
    const { audioElement, audioContext } = get();
    if (!audioElement || audioContext) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      
      const source = audioCtx.createMediaElementSource(audioElement);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;

      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      
      set({ audioContext: audioCtx, analyser });
    } catch (err) {
      console.warn('AudioContext setup failed:', err);
    }
  },
  
  togglePlay: async () => {
    const { isPlaying, audioElement, audioContext } = get();
    if (!audioElement) {
        console.error("No audio element found in store");
        return;
    }

    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (e) {
        console.error("AudioContext resume failed", e);
      }
    }

    const streamUrl = 'https://complex.in.ua/yantarne';

    if (isPlaying) {
      audioElement.pause();
      // Optional: reset src to stop buffering? For radio usually just pause is fine or src="" to stop download.
      // But user wants "pause".
      set({ isPlaying: false });
    } else {
      try {
        // Ensure we are playing the live stream
        if (audioElement.src !== streamUrl) {
            audioElement.src = streamUrl;
            audioElement.load();
        }
        await audioElement.play();
        set({ isPlaying: true });
      } catch (err) {
        console.error('Playback failed:', err);
        set({ isPlaying: false });
      }
    }
  }
}));

export default usePlayerStore;
