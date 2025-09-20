import React, { useState } from "react";
import DragDropIcon from "../../../assets/upload/background_gradient.svg";
import api from "../../../utils/api";

function AddNewItem({ isAddNewItemOpen, setIsAddNewItemOpen }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleClick = () => {
        console.log('AddNewItem 클릭됨, 현재 상태:', isAddNewItemOpen);
        setIsAddNewItemOpen(true);
        console.log('setIsAddNewItemOpen(true) 호출됨');
    };

    const handleCloseModal = () => {
        setIsAddNewItemOpen(false);
        setIsDragOver(false);
        setIsUploading(false);
        setUploadProgress(0);
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
        
        // 파일 업로드 시작
        await uploadFiles(files);
    };

    const uploadFiles = async (files) => {
        setIsUploading(true);
        setUploadProgress(0);
        
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                
                // 파일 업로드 API 호출
                console.log('업로드할 파일:', file.name, file.size);
                
                // 실제 API 호출
                const token = localStorage.getItem('accessToken'); // 토큰 가져오기
                const response = await api.post('/api/files/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('업로드 성공:', response.data);
                
                // 전체 파일 진행률 업데이트
                setUploadProgress(((i + 1) / files.length) * 100);
            }
            
            // 파일 업로드 완료 후 localStorage에 파일 정보 저장
            console.log('모든 파일 업로드 완료');
            
            // 업로드된 파일들을 localStorage에 저장 (진행률 표시용)
            const uploadedFiles = Array.from(files).map((file, index) => ({
                id: Date.now() + index,
                name: file.name,
                original_name: file.name,
                mime_type: file.type.startsWith('image/') ? 'image' : 'file',
                size: file.size,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                count: null,
                progress: 0 // 진행률 표시를 위해 0으로 시작
            }));
            
            // 기존 파일 목록에 새 파일들 추가
            const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
            console.log('기존 파일들:', existingFiles);
            console.log('새로 업로드된 파일들:', uploadedFiles);
            
            const updatedFiles = [...existingFiles, ...uploadedFiles];
            console.log('업데이트된 파일 목록:', updatedFiles);
            
            const updateProgress = async () => {
                const duration = 3000; 
                const steps = 60; 
                const stepDuration = duration / steps;
                
                for (let step = 0; step <= steps; step++) {
                    const progress = Math.round((step / steps) * 100);
                    
                    // 기존 파일들은 그대로 두고, 새로 업로드되는 파일들만 progress 추가
                    const filesWithProgress = updatedFiles.map(file => {
                        // 새로 업로드되는 파일인지 확인 (uploadedFiles에 있는 파일들)
                        const isNewFile = uploadedFiles.some(newFile => newFile.id === file.id);
                        
                        if (isNewFile) {
                            return { ...file, progress: progress };
                        } else {
                            return file; // 기존 파일은 그대로
                        }
                    });
                    
                    localStorage.setItem('uploadedFiles', JSON.stringify(filesWithProgress));
                    window.dispatchEvent(new CustomEvent('filesUpdated'));
                    
                    if (step < steps) {
                        await new Promise(resolve => setTimeout(resolve, stepDuration));
                    }
                }
                
                // 100% 완료 후 새로 업로드된 파일들에서만 progress 속성 제거
                const finalFiles = updatedFiles.map(file => {
                    const isNewFile = uploadedFiles.some(newFile => newFile.id === file.id);
                    
                    if (isNewFile) {
                        const { progress, ...fileWithoutProgress } = file;
                        return fileWithoutProgress;
                    } else {
                        return file; // 기존 파일은 그대로
                    }
                });
                
                localStorage.setItem('uploadedFiles', JSON.stringify(finalFiles));
                window.dispatchEvent(new CustomEvent('filesUpdated'));
                console.log('localStorage에 저장 완료');
            };
            
            updateProgress();
            
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            alert('파일 업로드에 실패했습니다.');
            setIsUploading(false);
            setUploadProgress(0);
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
