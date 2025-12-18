import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import api from "../../../utils/api";

function FileSuggested({ fileId, suggestedFolder, onConfirm, onReject }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    if (!suggestedFolder) return null;

    const handleOpen = (e) => {
        e.stopPropagation();
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPopoverPos({
                top: rect.top + rect.height / 2,
                left: rect.right + 8
            });
        }
        setIsOpen(!isOpen);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await api.post(`/files/${fileId}/confirm-move`);
            // 파일 목록 갱신
            window.dispatchEvent(new CustomEvent('filesUpdated'));
            if (onConfirm) onConfirm();
            setIsOpen(false);
        } catch (err) {
            console.error("폴더 이동 승인 실패:", err);
            alert("폴더 이동에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        try {
            await api.post(`/files/${fileId}/reject-move`);
            // 파일 목록 갱신
            window.dispatchEvent(new CustomEvent('filesUpdated'));
            if (onReject) onReject();
            setIsOpen(false);
        } catch (err) {
            console.error("폴더 이동 거절 실패:", err);
            alert("거절 처리에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 팝오버를 body에 Portal로 렌더링
    const popoverContent = isOpen && createPortal(
        <>
            {/* 백드롭 (클릭 시 닫기) */}
            <div 
                className="fixed inset-0"
                style={{ zIndex: 99998 }}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                }}
            />
            
            {/* 팝오버 내용 */}
            <div 
                className="fixed w-56 p-3 bg-white rounded-lg shadow-xl border border-gray-200"
                style={{
                    zIndex: 99999,
                    top: popoverPos.top,
                    left: popoverPos.left,
                    transform: 'translateY(-50%)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 화살표 */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />
                <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-200" />
                
                <p className="text-sm text-gray-700 mb-3">
                    "<span className="font-semibold text-[#0D4CFF]">{suggestedFolder.name}</span>" 
                    폴더로 이동을 추천합니다!
                </p>
                
                <div className="flex gap-2">
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? "..." : "승인"}
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={isLoading}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        거절
                    </button>
                </div>
            </div>
        </>,
        document.body
    );

    return (
        <div className="relative inline-block ml-1">
            {/* ! 배지 버튼 */}
            <button
                ref={buttonRef}
                onClick={handleOpen}
                className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] text-white text-[10px] md:text-xs font-bold flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                title="AI 폴더 추천"
            >
                !
            </button>

            {popoverContent}
        </div>
    );
}

export default FileSuggested;

