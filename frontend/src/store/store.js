import { create } from "zustand";

export const useModalStore = create((set) => ({
    // Profile Modal states
    isOpenProfileModal: false,
    setIsOpenProfileModal: (isOpen) => set({ isOpenProfileModal: isOpen }),
    
    // Rename Modal states
    isOpenRenameModal: false,
    setIsOpenRenameModal: (isOpen) => set({ isOpenRenameModal: isOpen }),
    renameItem: null, // 이름을 변경할 아이템 정보
    setRenameItem: (item) => set({ renameItem: item }),

    isOpenCreateItemModal: false,
    setIsOpenCreateItemModal: (isOpen) => set({ isOpenCreateItemModal: isOpen }),
    
    // Withdraw Modal states
    isOpenWithdrawModal: false,
    setIsOpenWithdrawModal: (isOpen) => set({ isOpenWithdrawModal: isOpen }),
}));

export const usePathStore = create((set) => ({
    // 현재 폴더 경로 (root 또는 폴더 ID)
    currentPath: 'root',
    setCurrentPath: (path) => set({ currentPath: path }),
    
    // 현재 경로 이름 (사용자에게 표시되는 경로, 예: "내 저장소 > test > subfolder")
    currentPathName: '내 저장소',
    setCurrentPathName: (pathName) => set({ currentPathName: pathName }),
    
    // 경로 히스토리 (뒤로가기 기능을 위해)
    pathHistory: ['root'],
    addToHistory: (path) => set((state) => ({ 
        pathHistory: [...state.pathHistory, path] 
    })),
    
    // 경로 이름 히스토리
    pathNameHistory: ['내 저장소'],
    addToPathNameHistory: (pathName) => set((state) => ({
        pathNameHistory: [...state.pathNameHistory, pathName]
    })),
    
    goBack: () => set((state) => {
        if (state.pathHistory.length > 1) {
            const newHistory = state.pathHistory.slice(0, -1);
            const newNameHistory = state.pathNameHistory.slice(0, -1);
            return {
                pathHistory: newHistory,
                pathNameHistory: newNameHistory,
                currentPath: newHistory[newHistory.length - 1],
                currentPathName: newNameHistory[newNameHistory.length - 1]
            };
        }
        return state;
    }),
    resetPath: () => set({ 
        currentPath: 'root', 
        pathHistory: ['root'],
        currentPathName: '내 저장소',
        pathNameHistory: ['내 저장소']
    }),
}));