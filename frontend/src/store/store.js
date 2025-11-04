import { create } from "zustand";

export const useModalStore = create((set) => ({
    // Profile Modal states
    isOpenProfileModal: false,
    setIsOpenProfileModal: (isOpen) => set({ isOpenProfileModal: isOpen }),
    
    // Rename Modal states
    isOpenRenameModal: false,
    setIsOpenRenameModal: (isOpen) => set({ isOpenRenameModal: isOpen }),
}));