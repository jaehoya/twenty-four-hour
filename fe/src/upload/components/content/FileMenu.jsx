import React, { useEffect, useRef, useState } from "react";

function FileMenu({ 
    isVisible, 
    position, 
    onClose, 
    onDownload, 
    onViewInfo, 
    onRename, 
    onDelete,
    onAddFavorite,
    onRestore,
    onPermanentDelete,
    mode = 'storage',
    fileName 
}) {
    const contextMenuRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const isTrashMode = mode === 'trash';

    // 모바일 여부 확인
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);

    // ESC 키로 메뉴 닫기
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div 
            ref={contextMenuRef}
            className="fixed bg-white rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.1)] border border-gray-200 py-1 z-[9999] min-w-[120px]"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -10px)'
            }}
        >
            {onDownload && (
                <button 
                    onClick={onDownload}
                    className="w-full px-3 py-2 text-left text-[12px] text-[#34475C] hover:bg-[#F5F7FA] transition-colors"
                >
                    다운로드
                </button>
            )}
            
            {/* 모바일에서만 정보 보기 메뉴 표시 */}
            {isMobile && onViewInfo && (
                <button 
                    onClick={onViewInfo}
                    className="w-full px-3 py-2 text-left text-[12px] text-[#34475C] hover:bg-[#F5F7FA] transition-colors"
                >
                    정보 보기
                </button>
            )}

            {!isTrashMode && onRename && (
                <button 
                    onClick={onRename}
                    className="w-full px-3 py-2 text-left text-[12px] text-[#34475C] hover:bg-[#F5F7FA] transition-colors"
                >
                    이름 바꾸기
                </button>
            )}
            {!isTrashMode && onAddFavorite && (
                <>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                        onClick={onAddFavorite}
                        className="w-full px-3 py-2 text-left text-[12px] text-[#34475C] hover:bg-[#F5F7FA] transition-colors"
                    >
                        즐겨찾기 추가
                    </button>
                </>
            )}
            {!isTrashMode && onDelete && (
                <>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                        onClick={onDelete}
                        className="w-full px-3 py-2 text-left text-[12px] text-[#FF4757] hover:bg-[#FFF5F5] transition-colors"
                    >
                        휴지통으로 이동
                    </button>
                </>
            )}

            {isTrashMode && (
                <>
                    {onRestore && (
                        <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                                onClick={onRestore}
                                className="w-full px-3 py-2 text-left text-[12px] text-[#34475C] hover:bg-[#F5F7FA] transition-colors"
                            >
                                복원하기
                            </button>
                        </>
                    )}
                    {onPermanentDelete && (
                        <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                                onClick={onPermanentDelete}
                                className="w-full px-3 py-2 text-left text-[12px] text-[#FF4757] hover:bg-[#FFF5F5] transition-colors"
                            >
                                영구 삭제
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default FileMenu;
