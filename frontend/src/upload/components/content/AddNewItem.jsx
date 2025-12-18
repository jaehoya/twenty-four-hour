import React, { useState } from "react";
import DragDropIcon from "../../../assets/upload/background_gradient.svg";
import MyButton from "./MyButton";
import api from "../../../utils/api";

function AddNewItem({ isAddNewItemOpen, setIsAddNewItemOpen, onFileUpload, currentFolderId = null }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(true);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    const handleClick = () => {
        setIsAddNewItemOpen(true);
        setShowSelectionModal(true);
        setShowFolderModal(false);
    };

    const handleCloseModal = () => {
        setIsAddNewItemOpen(false);
        setIsDragOver(false);
        setShowSelectionModal(true);
        setShowFolderModal(false);
        setFolderName("");
    };

    const handleSelectUpload = () => {
        setShowSelectionModal(false);
        setShowFolderModal(false);
    };

    const handleSelectFolder = () => {
        setShowSelectionModal(false);
        setShowFolderModal(true);
    };

    const handleCreateFolder = async () => {
        if (!folderName.trim()) {
            alert('폴더 이름을 입력해주세요.');
            return;
        }

        setIsCreatingFolder(true);

        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                alert('로그인이 필요합니다.');
                setIsCreatingFolder(false);
                return;
            }

            const response = await api.post('/folders', {
                name: folderName.trim(),
                parentId: currentFolderId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201 && response.data.state === 201) {

                // 폴더 목록 새로고침 이벤트 발생
                window.dispatchEvent(new CustomEvent('foldersUpdated'));

                handleCloseModal();
            }
        } catch (error) {
            console.error('폴더 생성 오류:', error);

            if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.code === 'NO_FOLDER_NAME') {
                    alert(errorData.message || '폴더 이름은 필수입니다.');
                } else if (errorData.code === 'UNAUTHORIZED') {
                    alert('인증이 필요합니다. 다시 로그인해주세요.');
                } else if (errorData.code === 'FORBIDDEN') {
                    alert('폴더 생성 권한이 없습니다.');
                } else if (errorData.message) {
                    alert(`폴더 생성 실패: ${errorData.message}`);
                } else {
                    alert('폴더 생성에 실패했습니다.');
                }
            } else {
                alert('폴더 생성에 실패했습니다.');
            }
        } finally {
            setIsCreatingFolder(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        // 드래그앤드롭 순간 모달 닫기
        handleCloseModal();

        // 파일 업로드 시작 (현재 폴더 ID 전달)
        if (onFileUpload) {
            onFileUpload(files, currentFolderId);
        }
    };


    return (
        <>
            <div
                className="relative rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center cursor-pointer transition-colors h-[149px] md:h-[229px] min-h-[149px] md:min-h-[229px] z-0"
                onClick={handleClick}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
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
                    <div className="fixed inset-0 backdrop-blur-sm z-[100] rounded-[16px]" onClick={handleCloseModal} />

                    {/* 모달 */}
                    <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none">
                        {showSelectionModal ? (
                            /* 선택 모달 - 폴더 추가 / 파일 업로드 */
                            <div
                                className="bg-white rounded-[20px] p-8 w-[90%] max-w-[346px] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(36,49,82,0.1)] pointer-events-auto"
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                {/* 닫기 버튼 */}
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>

                                <h2 className="text-[14pt] font-bold text-[#303642] mb-6">
                                    항목 추가
                                </h2>

                                {/* 선택 버튼들 */}
                                <div className="w-full space-y-2">
                                    <MyButton type="flat" onClick={handleSelectFolder} value="폴더 추가" />
                                    <MyButton type="flat" onClick={handleSelectUpload} value="파일 업로드" />
                                </div>
                            </div>
                        ) : showFolderModal ? (
                            /* 폴더 이름 입력 모달 */
                            <div
                                className="bg-white rounded-[20px] p-8 w-[90%] max-w-[346px] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(36,49,82,0.1)] pointer-events-auto"
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                {/* 닫기 버튼 */}
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>

                                <h2 className="text-[14pt] font-bold text-[#303642] mb-6">
                                    폴더 이름 입력
                                </h2>

                                {/* 폴더 이름 입력 필드 */}
                                <div className="w-full mb-4">
                                    <input
                                        type="text"
                                        value={folderName}
                                        onChange={(e) => setFolderName(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !isCreatingFolder) {
                                                handleCreateFolder();
                                            }
                                        }}
                                        placeholder="폴더 이름을 입력하세요"
                                        className="w-full px-4 py-3 border-[1px] border-[#DAE0E9] rounded-[7px] text-sm focus:outline-none focus:border-[#329CFF]"
                                        autoFocus
                                        disabled={isCreatingFolder}
                                    />
                                </div>

                                {/* 생성 버튼 */}
                                <div className="w-full">
                                    <MyButton
                                        type="gradient"
                                        onClick={handleCreateFolder}
                                        value={isCreatingFolder ? "생성 중..." : "폴더 생성"}
                                    />
                                </div>
                            </div>
                        ) : (
                            /* 파일 업로드 드래그앤드롭 모달 */
                            <div
                                className={`bg-white rounded-[20px] p-8 md:w-[90%] max-w-[346px] md:h-[35.92svh] max-h-[388px] flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_40px_rgba(36,49,82,0.1)] pointer-events-auto ${isDragOver ? 'bg-blue-50' : ''
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
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
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default AddNewItem;
