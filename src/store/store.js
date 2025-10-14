import { create } from 'zustand';

export const useStore = create((set) => ({
  isCNNPopupOpen: false,
  isBackPopupOpen: false,
  isTopSongPopupOpen: false,
  selectedSongId: null,
  selectedSongIndex: null,


  isAddPopupOpen: false,
  isEditPopupOpen: false,
  isDeletePopupOpen: false,
  selectedBlog: null,


  openCNNPopup: () => set({ isCNNPopupOpen: true }),
  closeCNNPopup: () => set({ isCNNPopupOpen: false }),


  openBackPopup: () => set({ isBackPopupOpen: true }),
  closeBackPopup: () => set({ isBackPopupOpen: false }),


  openTopSongPopup: (id, index) =>
    set({ isTopSongPopupOpen: true, selectedSongId: id, selectedSongIndex: index }),
  closeTopSongPopup: () =>
    set({ isTopSongPopupOpen: false, selectedSongId: null, selectedSongIndex: null }),


  openAddPopup: () => set({ isAddPopupOpen: true }),
  closeAddPopup: () => set({ isAddPopupOpen: false }),

  openEditPopup: (blog) => set({ isEditPopupOpen: true, selectedBlog: blog }),
  closeEditPopup: () => set({ isEditPopupOpen: false, selectedBlog: null }),

  openDeletePopup: (blog) => set({ isDeletePopupOpen: true, selectedBlog: blog}),
  closeDeletePopup: () => set({ isDeletePopupOpen: false, selectedBlog: null }),
}));
