import React, { useState, useRef } from "react";
import FolderIcon from "../../../assets/upload/folder_icon.svg";
import EmptyFolderIcon from "../../../assets/upload/empty_folder_icon.svg";
import FileIcon from "../../../assets/upload/file_icon.svg";
import ProgressCircle from "./ProgressCircle";
import FileMenu from "./FileMenu";

function FileItem({ item, isSelected = false, onClick }) {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const longPressTimer = useRef(null);
    // 폴더의 항목 수 확인
    const getItemCount = (count) => {
        if (!count) return 0;
        return parseInt(count.split('개의 항목')[0]);
    };

    const itemCount = (item.count) ? getItemCount(item.id) : 0;
    const isEmpty = item.mime_type === "folder" && itemCount === 0;

    // 길게 클릭 이벤트 핸들러
    const handleMouseDown = (e) => {
        longPressTimer.current = setTimeout(() => {
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }, 500); // 500ms 후 컨텍스트 메뉴 표시
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
            setContextMenuPosition({ x: touch.clientX, y: touch.clientY });
            setShowContextMenu(true);
        }, 500); // 500ms 후에 컨텍스트 메뉴 표시
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

    // 컨텍스트 메뉴 닫기
    const closeContextMenu = () => {
        setShowContextMenu(false);
    };

    // 컨텍스트 메뉴 액션들
    const handleDownload = () => {
        console.log('다운로드:', item.original_name);
        closeContextMenu();
    };

    const handleViewInfo = () => {
        console.log('정보 보기:', item.original_name);
        closeContextMenu();
        // 기본 동작 (파일 선택)
        onClick();
    };

    const handleRename = () => {
        console.log('이름 바꾸기:', item.original_name);
        closeContextMenu();
    };

    const handleDelete = () => {
        console.log('휴지통으로 이동:', item.original_name);
        closeContextMenu();
    };


    return (
        <>
            <div 
                className={`rounded-[15px] p-3 md:p-4 flex flex-col md:justify-center items-center cursor-pointer h-[149px] md:h-[229px] min-h-[149px] md:min-h-[229px] relative z-0 ${
                    isSelected ? "bg-[#E6F3FF] border-[#1C91FF] border-[3px]" : "bg-white border-gray-200 border-[1px]"
                }`}
                onClick={onClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
            >
            {/* 아이콘 */}
            <div className="flex items-center justify-center h-[65%] relative">
                {item.mime_type === "folder" ? (
                    <img 
                        src={isEmpty ? EmptyFolderIcon : FolderIcon} 
                        alt="folder" 
                        className="w-[57px] h-[43px] md:w-[135px] md:h-[101px]"
                    />
                ) : (
                    <div className="flex items-center justify-center relative w-full h-full">
                        <img src={FileIcon} alt="file" className="w-[44px] h-[55px] md:w-[100px] md:h-[125px]" />
                        
                        {/* 업로드 진행률 표시 - 업로드 중인 파일만 */}
                        {item.progress !== undefined && item.progress !== null && item.progress >= 0 && item.progress < 100 && (
                            <ProgressCircle progress={item.progress} size="md" />
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center w-full px-2">
                <div className="h-px w-full max-w-[102px] bg-[#E5EBF2] mb-3 md:hidden" />
            {/* 이름 */}
                <span className="text-[0.6875rem] md:text-[0.875rem] font-semibold text-[#34475C] text-center md:mt-1 truncate w-full max-w-full" title={item.original_name}>
                    {item.original_name}
                </span>
            
            {/* 메타데이터 */}
                <span className="text-[0.4375rem] md:text-[0.6875rem] text-[#9AA9B9] font-normal text-center truncate w-full max-w-full">
                    {item.count ? `${item.updatedAt} | ${item.count}` : new Date(item.updatedAt).toLocaleDateString()}
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
                onDelete={handleDelete}
                fileName={item.original_name}
            />
        </>
    )
}

export default FileItem;
