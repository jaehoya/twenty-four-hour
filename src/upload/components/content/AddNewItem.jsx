import React, { useState } from "react";
import DragDropIcon from "../../../assets/upload/background_gradient.svg";

function AddNewItem({ isAddNewItemOpen, setIsAddNewItemOpen, onFileUpload }) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleClick = () => {
        console.log('AddNewItem 클릭됨, 현재 상태:', isAddNewItemOpen);
        setIsAddNewItemOpen(true);
        console.log('setIsAddNewItemOpen(true) 호출됨');
    };

    const handleCloseModal = () => {
        setIsAddNewItemOpen(false);
        setIsDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length === 0) return;
        
        // 드래그앤드롭 순간 모달 닫기
        handleCloseModal();
        
        // 파일 업로드 시작 (folderId는 null로 전달)
        if (onFileUpload) {
            onFileUpload(files, null);
        }
    };


    return (
        <>
            <div 
                className="relative rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center cursor-pointer transition-colors h-[149px] md:h-[229px] min-h-[149px] md:min-h-[229px] z-0"
                onClick={handleClick}
            >
                {/* SVG 점선 테두리 */}
                <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none" 
                    style={{ borderRadius: '15px' }}
                >
                    <rect
                        x="1"
                        y="1"
                        width="calc(100% - 2px)"
                        height="calc(100% - 2px)"
                        rx="14"
                        ry="14"
                        fill="none"
                        stroke="#BCC3CD"
                        strokeWidth="2"
                        strokeDasharray="5 6"
                    />
                </svg>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    <span className="text-2xl md:text-[3.1875rem] font-light text-[#BCC3CD]">+</span>
                </div>
            </div>

            {/* 모달 */}
            {isAddNewItemOpen && (
                <>
                    {/* 배경 오버레이 */}
                    <div className="fixed inset-0 backdrop-blur-sm z-[100] border-[3px] border-[#329CFF] rounded-[15px]" />
                    
                    {/* 모달 */}
                    <div className="fixed inset-0 flex items-center justify-center z-[110]">
                    <div 
                        className={`bg-white rounded-[20px] p-8 md:w-[18.02svw] max-w-[346px] md:h-[35.92svh] max-h-[388px] flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_40px_rgba(36,49,82,0.1)] ${
                            isDragOver ? 'bg-blue-50' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>

                        {/* 드래그 앤 드롭 영역 */}
                        <div className="flex flex-col items-center justify-center flex-1 w-full">
                            <h2 className="text-[0.875rem] md:text-[1.25rem] font-bold text-[#303642] mt-3 mb-15 whitespace-nowrap">
                                이곳에 놓아주세요!
                            </h2>
                            
                            {/* 드롭 영역 그래픽 */}
                            <div className="w-32 h-32 md:w-[8.59svw] md:h-[15.27svh] mb-6 rounded-full relative">
                                <img 
                                    src={DragDropIcon} 
                                    alt="drag_drop" 
                                    className={`w-full h-full rounded-full transition-transform duration-300 ${isDragOver ? '' : 'animate-slow-spin'}`}
                                    style={{
                                        filter: 'blur(34px)',
                                        background: `
                                            radial-gradient(circle at 20% 50%, #0D4CFF 0.9px, transparent 0.9px),
                                            radial-gradient(circle at 80% 20%, #FFFFFF 0.9px, transparent 0.9px),
                                            radial-gradient(circle at 40% 80%, #0D4CFF 0.9px, transparent 0.9px),
                                            radial-gradient(circle at 60% 40%, #FFFFFF 0.9px, transparent 0.9px),
                                            linear-gradient(45deg, #0D4CFF 90%, #FFFFFF 10%)
                                        `,
                                        backgroundSize: '20px 20px, 15px 15px, 25px 25px, 18px 18px, 100% 100%',
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </div>
                </>
            )}
        </>
    )
}

export default AddNewItem;
