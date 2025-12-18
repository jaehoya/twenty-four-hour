import React, { useEffect, useState } from "react";
import FileItem from "../content/FileItem";
import FolderItem from "../content/FolderItem";
import AddNewItem from "../content/AddNewItem";
import UploadedFiles from "../content/UploadedFiles";
import api from "../../../utils/api";
import { usePathStore } from "../../../store/store";

function Data({ selectedItem, onItemSelect, isAddNewItemOpen, setIsAddNewItemOpen, onFileUpload, activeTab, sortOption = '이름', searchQuery = '' }) {
    const [files, setFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const { currentPath, goBack, resetPath, pathHistory } = usePathStore();
    const parentId = pathHistory.length > 1 ? pathHistory[pathHistory.length - 2] : 'root';
    const isRoot = currentPath === 'root';
    const [currentTrashFolderId, setCurrentTrashFolderId] = useState(null);

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
                        favoriteId: fav.id, // 즐겨찾기 ID 추가
                    }));
                // 정렬 적용
                const sortedFavs = sortItems(favoriteFiles, sortOption);
                setFiles(sortedFavs);
            } else if (currentTab === 'trash') {
                // 휴지통 목록 조회
                if (currentTrashFolderId === null) {
                    // 휴지통 루트
                    response = await api.get('/trash', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else {
                    // 휴지통 폴더 내부
                    response = await api.get(`/trash/folders/${currentTrashFolderId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

                const trashData = response.data || {};
                const trashFiles = trashData.files || [];
                const trashFolders = trashData.folders || [];

                // 파일 정규화
                const normalizedFiles = trashFiles.map(file => ({
                    id: file.id,
                    name: file.name || file.original_name,
                    original_name: file.original_name || file.name,
                    size: file.size,
                    mime_type: file.mimeType || file.mime_type || 'file',
                    mimeType: file.mimeType || file.mime_type || 'file',
                    createdAt: file.createdAt || file.deletedAt,
                    deletedAt: file.deletedAt,
                    isFavorite: file.isFavorite || false,
                    isDeleted: true,
                }));

                // 폴더 정규화
                const normalizedFolders = trashFolders.map(folder => ({
                    id: folder.id,
                    name: folder.name,
                    original_name: folder.name,
                    mime_type: 'folder',
                    mimeType: 'folder',
                    createdAt: folder.createdAt || folder.deletedAt,
                    updatedAt: folder.updatedAt,
                    deletedAt: folder.deletedAt,
                    isFavorite: folder.isFavorite || false,
                    parentId: folder.parentId,
                    userId: folder.userId,
                    isDeleted: true,
                }));

                // 폴더와 파일 합치기
                const allTrashItems = [...normalizedFolders, ...normalizedFiles];
                const sortedTrash = sortItems(allTrashItems, sortOption);
                setFiles(sortedTrash);
            } else {
                // 하위 폴더 조회 (현재 경로)
                let folders = [];
                try {
                    const foldersResponse = await api.get(`/folders/${currentPath}/subfolders`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    folders = (foldersResponse.data.folders || []).map(folder => ({
                        id: folder.id,
                        name: folder.name,
                        original_name: folder.name,
                        mime_type: 'folder',
                        mimeType: 'folder',
                        createdAt: folder.createdAt,
                        updatedAt: folder.updatedAt,
                        isFavorite: folder.isFavorite || false,
                        parentId: folder.parentId,
                        userId: folder.userId,
                    }));
                } catch (folderErr) {
                    console.error('폴더 목록 조회 실패:', folderErr);
                    folders = [];
                }

                // 현재 경로의 파일 목록 조회
                let files = [];
                try {
                    const filesResponse = await api.get(`/folders/${currentPath}/files`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // API 응답 형식에 맞게 변환
                    files = (filesResponse.data.files || []).map(item => ({
                        ...item,
                        original_name: item.original_name || item.name,
                        mime_type: item.mimeType || item.mime_type || 'file',
                    }));
                } catch (filesErr) {
                    console.error('파일 목록 조회 실패:', filesErr);
                    files = [];
                }

                // 정렬: 폴더와 파일은 각각 정렬하고 폴더를 먼저 표시
                const sortedFolders = sortItems(folders, sortOption);
                const sortedFiles = sortItems(files, sortOption);
                const normalizedFiles = sortedFiles.map(item => ({
                    ...item,
                    mimeType: item.mimeType || item.mime_type || 'file',
                }));

                setFiles([...sortedFolders, ...normalizedFiles]);
            }
        } catch (err) {
            setFiles([]); // 에러 시 빈 배열로 설정
        }
    }, [activeTab, currentPath, currentTrashFolderId]);

    // 정렬 유틸리티: 이름(오름차순), 생성한 날짜(최신순)
    function sortItems(list, option) {
        if (!Array.isArray(list)) return list;
        const arr = [...list];

        if (option === '이름') {
            return arr.sort((a, b) => {
                const na = (a.name || a.original_name || '').toString();
                const nb = (b.name || b.original_name || '').toString();
                return na.localeCompare(nb, 'ko');
            });
        }

        if (option === '생성한 날짜') {
            return arr.sort((a, b) => {
                const ta = Date.parse(a.createdAt || a.updatedAt || 0) || 0;
                const tb = Date.parse(b.createdAt || b.updatedAt || 0) || 0;
                return tb - ta; // 최신순
            });
        }

        return arr;
    }

    // 검색 필터링 함수
    const filterBySearch = (items, query) => {
        if (!query || query.trim() === '') return items;

        const lowerQuery = query.toLowerCase().trim();
        return items.filter(item => {
            const name = (item.name || item.original_name || '').toLowerCase();
            return name.includes(lowerQuery);
        });
    };

    // 검색된 파일 목록
    const filteredFiles = filterBySearch(files, searchQuery);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // 파일 업로드 및 폴더 생성 후 목록 새로고침
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

        const handleFoldersUpdate = (event) => {
            if (!isMounted) return;
            if (isFetching) {
                return;
            }

            isFetching = true;

            // 폴더 생성 후 즉시 새로고침
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
            }, 100);
        };

        window.addEventListener('filesUpdated', handleFilesUpdate);
        window.addEventListener('foldersUpdated', handleFoldersUpdate);

        return () => {
            isMounted = false;
            isFetching = false;
            window.removeEventListener('filesUpdated', handleFilesUpdate);
            window.removeEventListener('foldersUpdated', handleFoldersUpdate);
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

        // 파일 업로드 시작 (현재 폴더 ID 전달)
        const folderId = currentPath === 'root' ? null : currentPath;
        if (onFileUpload) {
            onFileUpload(files, folderId);
        }
    };

    return (
        <div
            className={`w-full h-full rounded-[10px] relative overflow-y-auto scrollbar-hide flex flex-col transition-colors ${isDragOver && activeTab === 'storage' ? 'bg-blue-50' : ''
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
                {/* 검색 결과가 없을 때 */}
                {searchQuery && filteredFiles.length === 0 && (
                    <div className="col-span-3 md:col-span-5 flex flex-col items-center justify-center py-12 text-gray-500">
                        <p className="text-lg mb-2">검색 결과가 없습니다</p>
                        <p className="text-sm">'{searchQuery}'에 대한 파일이나 폴더를 찾을 수 없습니다</p>
                    </div>
                )}

                {/* 상위 폴더로 이동 (루트가 아닐 때만 표시) */}
                {!isRoot && !searchQuery && activeTab === 'storage' && (
                    <FolderItem
                        key="parent-folder-item"
                        item={{
                            id: parentId === 'root' ? null : parentId, // 루트면 null로 전달
                            name: "../", // 상위 폴더
                            updatedAt: new Date(),
                            createdAt: new Date()
                        }}
                        onClick={() => goBack()} // 클릭 시 뒤로가기
                        activeTab={activeTab}
                        onFolderDeleted={fetchFiles} // 이동 후 새로고침 (드래그앤드롭 이동 시)
                        isParentFolder={true} // 상위 폴더임을 명시
                    />
                )}
                {/* 파일/폴더가 없을 때 (검색 중이 아닐 때) - 모바일에서만 표시 */}
                {!searchQuery && filteredFiles.length === 0 && (
                    <div className="md:hidden col-span-3 flex flex-col items-center justify-center py-16 text-gray-400">
                        <svg
                            className="w-16 h-16 mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                        </svg>
                        <p className="text-base mb-1 text-gray-500">파일이 없습니다</p>
                        <p className="text-xs text-gray-400">
                            {activeTab === 'storage' ? '파일을 업로드하거나 폴더를 생성해보세요' : '항목이 비어있습니다'}
                        </p>
                    </div>
                )}

                {/* 폴더 먼저 렌더링 */}
                {filteredFiles
                    .filter(item => item.mimeType === 'folder')
                    .map((folder) => (
                        <FolderItem
                            key={`folder-${folder.id}`}
                            item={folder}
                            isSelected={selectedItem?.id === folder.id && selectedItem?.mimeType === 'folder'}
                            onClick={() => onItemSelect(folder)}
                            onFolderDeleted={fetchFiles}
                            activeTab={activeTab}
                            onEnterTrashFolder={(folderId) => {
                                setCurrentTrashFolderId(folderId);
                            }}
                        />
                    ))
                }

                {/* 파일 나중에 렌더링 */}
                {filteredFiles
                    .filter(item => item.mimeType !== 'folder')
                    .map((file) => (
                        <FileItem
                            key={`file-${file.id}`}
                            item={file}
                            isSelected={selectedItem?.id === file.id && selectedItem?.mimeType !== 'folder'}
                            onClick={() => onItemSelect(file)}
                            onFileDeleted={fetchFiles}
                            activeTab={activeTab}
                        />
                    ))
                }

                {/* 새 항목 추가 버튼 - 전체 저장소에서만 표시, 검색 중이 아닐 때만 */}
                {activeTab === 'storage' && !searchQuery && (
                    <div className="hidden md:block">
                        <AddNewItem
                            isAddNewItemOpen={isAddNewItemOpen}
                            setIsAddNewItemOpen={setIsAddNewItemOpen}
                            onFileUpload={onFileUpload}
                            currentFolderId={currentPath === 'root' ? null : currentPath}
                        />
                    </div>
                )}
            </div>

        </div>
    )
}

export default Data;