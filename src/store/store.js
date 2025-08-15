import { create } from 'zustand';



export const useStore = create((set) => ({
    isCNNPopupOpen: false,
    isBackPopupOpen: false,
  
    openCNNPopup: () => set({ isCNNPopupOpen: true }),
    closeCNNPopup: () => set({ isCNNPopupOpen: false }),
  
    openBackPopup: () => set({ isBackPopupOpen: true }),
    closeBackPopup: () => set({ isBackPopupOpen: false }),
  }));