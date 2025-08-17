import { create } from 'zustand';

export const useStore = create((set) => ({
  // existing states
  isCNNPopupOpen: false,
  isBackPopupOpen: false,
  isTopSongPopupOpen: false,
  selectedSongId: null,
  selectedSongIndex: null,

  // blog popups
  isAddPopupOpen: false,
  isEditPopupOpen: false,
  isDeletePopupOpen: false,
  selectedBlog: null,

  // CNN popup
  openCNNPopup: () => set({ isCNNPopupOpen: true }),
  closeCNNPopup: () => set({ isCNNPopupOpen: false }),

  // Back popup
  openBackPopup: () => set({ isBackPopupOpen: true }),
  closeBackPopup: () => set({ isBackPopupOpen: false }),

  // TopSong popup
  openTopSongPopup: (id, index) =>
    set({ isTopSongPopupOpen: true, selectedSongId: id, selectedSongIndex: index }),
  closeTopSongPopup: () =>
    set({ isTopSongPopupOpen: false, selectedSongId: null, selectedSongIndex: null }),

  // Blog popups
  openAddPopup: () => set({ isAddPopupOpen: true }),
  closeAddPopup: () => set({ isAddPopupOpen: false }),

  openEditPopup: (blog) => set({ isEditPopupOpen: true, selectedBlog: blog }),
  closeEditPopup: () => set({ isEditPopupOpen: false, selectedBlog: null }),

  openDeletePopup: (blog) => set({ isDeletePopupOpen: true, selectedBlog: blog}),
  closeDeletePopup: () => set({ isDeletePopupOpen: false, selectedBlog: null }),
}));
