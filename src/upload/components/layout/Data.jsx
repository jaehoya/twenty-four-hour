import React, { useEffect, useState } from "react";
import FileItem from "../content/FileItem";
import AddNewItem from "../content/AddNewItem";
import UploadedFiles from "../content/UploadedFiles";
import api from "../../../utils/api";

function Data({ selectedItem, onItemSelect, isAddNewItemOpen, setIsAddNewItemOpen, onFileUpload, activeTab }) {
    const [ files, setFiles ] = useState([]);
    const [ isDragOver, setIsDragOver ] = useState(false);

    // Fetch Files from API
    const fetchFiles = React.useCallback(async () => {
        const currentTab = activeTab; // 클로저 문제 방지를 위해 현재 activeTab 저장
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setFiles([]);
            return;
        }

        try {
            let response;
                if (currentTab === 'favorite') {
                    // 즐겨찾기 목록 조회
                    response = await api.get('/favorites', { 
                        headers: { Authorization: `Bearer ${token}` } 
                    });
                    // 즐겨찾기 응답 형식에 맞게 변환
                    const favorites = response.data.favorites || [];
                    const favoriteFiles = favorites
                        .filter(fav => fav.targetType === 'file' && fav.file)
                        .map(fav => ({
                            id: fav.file.id,
                            name: fav.file.name,
                            original_name: fav.file.name,
                            size: fav.file.size,
                            mime_type: 'file',
                            mimeType: 'file',
                            createdAt: fav.createdAt,
                            isFavorite: true,
                        }));
                    setFiles(favoriteFiles);
                } else if (currentTab === 'trash') {
                    // 휴지통은 아직 API가 없으므로 빈 배열
                    // TODO: 휴지통 API 구현 후 추가
                    setFiles([]);
                } else {
                    // 전체 파일 목록 조회
                    response = await api.get('/files', { 
                        headers: { Authorization: `Bearer ${token}` }, 
                        params: { search: undefined, sortBy: undefined, sortOrder: undefined } 
                    });
                    // API 응답 형식에 맞게 변환
                    const allFiles = (response.data.files || []).map(file => ({
                        ...file,
                        original_name: file.original_name || file.name,
                        mime_type: file.mimeType || file.mime_type || 'file',
                    }));
                    setFiles(allFiles);
                }
        } catch (err) {
            setFiles([]); // 에러 시 빈 배열로 설정
        }
    }, [activeTab]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // 파일 업로드 후 목록 새로고침
    useEffect(() => {
        let isMounted = true; // 컴포넌트가 마운트되어 있는지 확인
        let isFetching = false; // 이미 fetchFiles가 실행 중인지 확인
        
        const handleFilesUpdate = (event) => {
            if (!isMounted) return; // 컴포넌트가 언마운트되었으면 무시
            if (isFetching) {
                return; // 이미 실행 중이면 건너뜀
            }
            
            isFetching = true;
            
            // 약간의 지연 후 새로고침 (업로드 완료 대기)
            setTimeout(() => {
                if (!isMounted) {
                    isFetching = false;
                    return;
                }
                fetchFiles().then(() => {
                    isFetching = false;
                }).catch(err => {
                    isFetching = false;
                });
            }, 200);
        };

        window.addEventListener('filesUpdated', handleFilesUpdate);

        return () => {
            isMounted = false;
            isFetching = false;
            window.removeEventListener('filesUpdated', handleFilesUpdate);
        };
    }, [fetchFiles]);

    // 드래그앤드롭 핸들러 (전체 저장소에서만 작동)
    const handleDragOver = (e) => {
        if (activeTab !== 'storage') return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        if (activeTab !== 'storage') return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = async (e) => {
        if (activeTab !== 'storage') return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length === 0) return;
        
        // 모달이 열려있으면 닫기
        if (isAddNewItemOpen && setIsAddNewItemOpen) {
            setIsAddNewItemOpen(false);
        }
        
        // 파일 업로드 시작
        if (onFileUpload) {
            onFileUpload(files, null);
        }
    };

    return (
        <div 
            className={`w-full h-full rounded-[10px] relative overflow-y-auto scrollbar-hide flex flex-col transition-colors ${
                isDragOver && activeTab === 'storage' ? 'bg-blue-50' : ''
            }`}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* 반응형 그리드 - 모바일: 3개, 데스크톱: 5개 */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-2 md:gap-x-3 gap-y-1 md:gap-y-3 auto-rows-max">
                {/* 업로드된 파일들 */}
                {/* <UploadedFiles 
                    selectedItem={selectedItem}
                    onItemSelect={onItemSelect}
                /> */}
                {/* FileItem 컴포넌트들 */}
                {files.map((file) => {
                    return <FileItem
                        key={file.id}
                        item={file}
                        isSelected={selectedItem?.id === file.id}
                        onClick={() => onItemSelect(file)}
                        onFileDeleted={fetchFiles}
                    />
                })}
                {/* 새 항목 추가 버튼 - 전체 저장소에서만 표시 */}
                {activeTab === 'storage' && (
                    <div className="hidden md:block">
                        <AddNewItem 
                            isAddNewItemOpen={isAddNewItemOpen}
                            setIsAddNewItemOpen={setIsAddNewItemOpen}
                            onFileUpload={onFileUpload}
                        />
                    </div>
                )}
            </div>
            
        </div>
    )
}

export default Data;