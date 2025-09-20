import React, { useState } from "react";

function AddNewItem() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        // 파일 업로드 로직 처리
        const files = e.dataTransfer.files;
        console.log('Dropped files:', files);
        // TODO: 파일 업로드 처리
    };

    return (
        <>
            <div 
                className="relative rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors h-[149px] md:h-[229px] min-h-[149px] md:min-h-[229px]"
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

            {/* 모달 오버레이 */}
            {isModalOpen && (
                <div className="w-full h-full bg-[#A4CFFF]/22 flex items-center justify-center z-50">
                    <div 
                        className={`bg-white rounded-[20px] p-8 w-[50vw] max-w-[500px] h-[60vh] max-h-[400px] flex flex-col items-center justify-center transition-all duration-300 ${
                            isDragOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-dashed border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>

                        {/* 드래그 앤 드롭 영역 */}
                        <div className="flex flex-col items-center justify-center flex-1 w-full">
                            <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-6">
                                이곳에 놓아주세요!
                            </h2>
                            
                            {/* 드롭 영역 그래픽 */}
                            <div className="w-32 h-32 md:w-40 md:h-40 mb-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-60"></div>
                                <div className="absolute inset-2 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-40"></div>
                                <div className="absolute inset-4 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-20"></div>
                                
                                {/* 중앙 점들 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
                                </div>
                            </div>

                            <p className="text-gray-600 text-center mb-4">
                                파일을 드래그하여 여기에 놓거나<br />
                                클릭하여 파일을 선택하세요
                            </p>
                            
                            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                파일 선택
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddNewItem;
