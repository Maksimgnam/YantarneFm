import { create } from 'zustand';

export const useStore = create((set) => ({
  isCNNPopupOpen: false,
  isBackPopupOpen: false,
  isTopSongPopupOpen: false,

  selectedSongId: null,
  selectedSongIndex: null,

  openCNNPopup: () => set({ isCNNPopupOpen: true }),
  closeCNNPopup: () => set({ isCNNPopupOpen: false }),

  openBackPopup: () => set({ isBackPopupOpen: true }),
  closeBackPopup: () => set({ isBackPopupOpen: false }),

  openTopSongPopup: (id, index) => set({ isTopSongPopupOpen: true, selectedSongId: id, selectedSongIndex: index }),
  closeTopSongPopup: () => set({ isTopSongPopupOpen: false, selectedSongId: null, selectedSongIndex: null }),
}));
