import { create } from 'zustand';

const useSidebarStore = create((set) => ({
    isMenuOpen: false,
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    closeMenu: () => set({ isMenuOpen: false })
}));

export default useSidebarStore;
