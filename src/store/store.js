import { create } from "zustand";

export const useModalStore = create((set) => ({
    // Profile Modal states
    isOpenProfileModal: false,
    setIsOpenProfileModal: (isOpen) => set({ isOpenProfileModal: isOpen }),
    
    // Rename Modal states
    isOpenRenameModal: false,
    setIsOpenRenameModal: (isOpen) => set({ isOpenRenameModal: isOpen }),

    isOpenCreateItemModal: false,
    setIsOpenCreateItemModal: (isOpen) => set({ isOpenCreateItemModal: isOpen }),
}));

export const usePathStore = create((set) => ({
    // 현재 폴더 경로 (root 또는 폴더 ID)
    currentPath: 'root',
    setCurrentPath: (path) => set({ currentPath: path }),
    
    // 경로 히스토리 (뒤로가기 기능을 위해)
    pathHistory: ['root'],
    addToHistory: (path) => set((state) => ({ 
        pathHistory: [...state.pathHistory, path] 
    })),
    goBack: () => set((state) => {
        if (state.pathHistory.length > 1) {
            const newHistory = state.pathHistory.slice(0, -1);
            return {
                pathHistory: newHistory,
                currentPath: newHistory[newHistory.length - 1]
            };
        }
        return state;
    }),
    resetPath: () => set({ currentPath: 'root', pathHistory: ['root'] }),
}));