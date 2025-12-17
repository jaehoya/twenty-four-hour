import React, { useState, useRef } from "react";
import FolderIcon from "../../../assets/upload/folder_icon.svg";
import EmptyFolderIcon from "../../../assets/upload/empty_folder_icon.svg";
import FileMenu from "./FileMenu";
import { useModalStore, usePathStore } from '../../../store/store';
import api from "../../../utils/api";

function FolderItem({ item, isSelected = false, onClick, onFolderDeleted, activeTab = 'storage' }) {
    const { setIsOpenRenameModal, setRenameItem } = useModalStore();
    const { currentPath, setCurrentPath, addToHistory, currentPathName, addToPathNameHistory, setCurrentPathName } = usePathStore();
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const longPressTimer = useRef(null);

    // 모바일 체크
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 폴더는 항상 일반 폴더 아이콘 사용
    const isEmpty = false; // API에서 폴더 내 항목 수를 제공하지 않으므로 항상 false

    // 길게 클릭 이벤트 핸들러
    const handleMouseDown = (e) => {
        longPressTimer.current = setTimeout(() => {
            // 길게 눌렀을 때 선택
            if (onClick) onClick();
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }, 500);
    };

    const handleMouseUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleMouseLeave = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    // 모바일 터치 이벤트 핸들러
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        longPressTimer.current = setTimeout(() => {
            // 길게 눌렀을 때 선택
            if (onClick) onClick();
            setContextMenuPosition({ x: touch.clientX, y: touch.clientY });
            setShowContextMenu(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleTouchCancel = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    // 우클릭 이벤트 핸들러
    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 우클릭 시 폴더 선택
        if (onClick) onClick();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    };

    // 컨텍스트 메뉴 닫기
    const closeContextMenu = () => {
        setShowContextMenu(false);
    };

    // 폴더 진입 함수
    const enterFolder = () => {
        // 경로 히스토리에 추가
        addToHistory(item.id);
        // 경로 이름 히스토리에 추가
        addToPathNameHistory(item.name);
        // 현재 경로를 폴더 ID로 변경
        setCurrentPath(item.id);
        // 현재 경로 이름도 업데이트
        setCurrentPathName(item.name);
    };

    // 싱글클릭 핸들러
    const handleClick = (e) => {
        // 휴지통 탭에서는 폴더 진입 불가
        if (isTrashTab) {
            if (onClick) onClick();
            return;
        }
        
        if (isMobile) {
            // 모바일: 싱글 클릭으로 폴더 진입
            enterFolder();
        } else {
            // 데스크톱: 싱글 클릭으로 선택만
            if (onClick) onClick();
        }
    };

    // 더블클릭 핸들러 (데스크톱 전용)
    const handleDoubleClick = () => {
        // 휴지통 탭에서는 폴더 진입 불가
        if (isTrashTab) {
            return;
        }
        
        if (!isMobile) {
            enterFolder();
        }
    };

    // 컨텍스트 메뉴 액션들
    const handleDownload = async () => {
        // 폴더는 다운로드 불가
        alert('폴더는 다운로드할 수 없습니다.');
        closeContextMenu();
    };

    const handleViewInfo = () => {
        closeContextMenu();
        onClick();
    };

    const handleRename = () => {
        closeContextMenu();
        setRenameItem(item);
        setIsOpenRenameModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('로그인이 필요합니다.');
                closeContextMenu();
                return;
            }

            // 삭제 확인
            if (!confirm(`${item.name} 폴더를 휴지통으로 이동하시겠습니까?`)) {
                closeContextMenu();
                return;
            }

            const response = await api.delete(`/folders/${item.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('폴더가 휴지통으로 이동되었습니다.');
                // 폴더 목록 새로고침
                if (onFolderDeleted) {
                    onFolderDeleted();
                }
            } else {
                throw new Error('폴더 삭제 실패');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(`폴더 삭제 실패: ${error.response.data.message}`);
            } else {
                alert('폴더 삭제에 실패했습니다.');
            }
        }
        closeContextMenu();
    };

    const handleRestore = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('로그인이 필요합니다.');
                closeContextMenu();
                return;
            }

            const response = await api.post(`/trash/${item.id}/restore?type=folder`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('폴더가 복원되었습니다.');
                if (onFolderDeleted) {
                    onFolderDeleted();
                }
            } else {
                throw new Error('폴더 복원 실패');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(`폴더 복원 실패: ${error.response.data.message}`);
            } else {
                alert('폴더 복원에 실패했습니다.');
            }
        }
        closeContextMenu();
    };

    const handlePermanentDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('로그인이 필요합니다.');
                closeContextMenu();
                return;
            }

            // 영구 삭제 확인
            if (!confirm(`${item.name} 폴더를 영구적으로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
                closeContextMenu();
                return;
            }

            const response = await api.delete(`/trash/${item.id}?type=folder`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('폴더가 영구적으로 삭제되었습니다.');
                if (onFolderDeleted) {
                    onFolderDeleted();
                }
            } else {
                throw new Error('폴더 영구 삭제 실패');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(`폴더 영구 삭제 실패: ${error.response.data.message}`);
            } else {
                alert('폴더 영구 삭제에 실패했습니다.');
            }
        }
        closeContextMenu();
    };

    return (
        <>
            <div 
                className={`rounded-[15px] p-3 md:p-4 flex flex-col md:justify-center items-center cursor-pointer h-[149px] md:h-[229px] min-h-[149px] md:min-h-[229px] relative z-0 ${
                    isSelected ? "bg-[#E6F3FF] border-[#1C91FF] border-[3px]" : "bg-white border-gray-200 border-[1px]"
                }`}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                onContextMenu={handleContextMenu}
            >
                {/* 폴더 아이콘 */}
                <div className="flex items-center justify-center h-[65%] relative">
                    <img 
                        src={isEmpty ? EmptyFolderIcon : FolderIcon} 
                        alt="folder" 
                        className="w-[57px] h-[43px] md:w-[135px] md:h-[101px]"
                    />
                </div>
                
                <div className="flex flex-col items-center w-full px-2">
                    <div className="h-px w-full max-w-[102px] bg-[#E5EBF2] mb-3 md:hidden" />
                    
                    {/* 폴더 이름 */}
                    <span className="text-[0.6875rem] md:text-[0.875rem] font-semibold text-[#34475C] text-center md:mt-1 truncate w-full max-w-full" title={item.name}>
                        {item.name}
                    </span>
                
                    {/* 메타데이터 - 수정 날짜 표시 */}
                    <span className="text-[0.4375rem] md:text-[0.6875rem] text-[#9AA9B9] font-normal text-center truncate w-full max-w-full">
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* 파일 메뉴 */}
            <FileMenu
                isVisible={showContextMenu}
                position={contextMenuPosition}
                onClose={closeContextMenu}
                onDownload={handleDownload}
                onViewInfo={handleViewInfo}
                onRename={handleRename}
                onDelete={isTrashTab ? null : handleDelete}
                onRestore={isTrashTab ? handleRestore : null}
                onPermanentDelete={isTrashTab ? handlePermanentDelete : null}
                mode={activeTab}
                fileName={item.name}
            />
        </>
    );
}

export default FolderItem;
