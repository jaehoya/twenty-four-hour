import React, { useState, useRef } from "react";
import FolderIcon from "../../../assets/upload/folder_icon.svg";
import EmptyFolderIcon from "../../../assets/upload/empty_folder_icon.svg";
import FileIcon from "../../../assets/upload/file_icon.svg";
import ProgressCircle from "./ProgressCircle";
import FileMenu from "./FileMenu";
import { useModalStore } from '../../../store/store';
import api from "../../../utils/api";

function FileItem({ item, isSelected = false, onClick, onFileDeleted }) {
    const { setIsOpenRenameModal } = useModalStore();

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

    // 우클릭 이벤트 핸들러
    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    };

    // 컨텍스트 메뉴 닫기
    const closeContextMenu = () => {
        setShowContextMenu(false);
    };

    // 컨텍스트 메뉴 액션들
    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            
            // 토큰이 없으면 에러 (백엔드 연동 시 필요)
            if (!token) {
                alert('로그인이 필요합니다.');
                closeContextMenu();
                return;
            }

            // 다운로드 시도
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/api'}/files/${item.id}/download`, {
                method: 'GET',
                headers: headers,
            });

            if (!response.ok) {
                // 404 에러 처리
                if (response.status === 404) {
                    const errorData = await response.json().catch(() => ({}));
                    if (errorData.code === 'FILE_NOT_FOUND') {
                        alert('파일을 찾을 수 없습니다.');
                    } else {
                        alert('파일을 찾을 수 없습니다.');
                    }
                } else {
                    alert('파일 다운로드에 실패했습니다.');
                }
                throw new Error('다운로드 실패');
            }

            // Content-Disposition 헤더에서 파일명 추출 (한글 파일명 지원)
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = item.original_name || item.name;
            
            if (contentDisposition) {
                // filename*=UTF-8'' 형식에서 파일명 추출
                const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
                if (utf8Match) {
                    fileName = decodeURIComponent(utf8Match[1]);
                } else {
                    // 일반 filename= 형식
                    const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
                    if (filenameMatch) {
                        fileName = filenameMatch[1];
                    }
                }
            }
            
            // 파일 다운로드를 위한 Blob 생성
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // 다운로드 성공 (브라우저가 자동으로 다운로드를 처리하므로 별도 알림은 생략)
        } catch (error) {
            // 백엔드 연결 실패 시 모킹 다운로드
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.code === 'ECONNREFUSED') {
                const fileName = item.original_name || item.name || 'sample_file';
                const mockContent = `이것은 모킹 파일입니다.\n파일명: ${fileName}\n파일 ID: ${item.id}`;
                
                // 파일 확장자에 맞는 MIME 타입 결정
                const getMimeType = (filename) => {
                    const ext = filename.split('.').pop()?.toLowerCase();
                    const mimeTypes = {
                        'pdf': 'application/pdf',
                        'jpg': 'image/jpeg',
                        'jpeg': 'image/jpeg',
                        'png': 'image/png',
                        'gif': 'image/gif',
                        'doc': 'application/msword',
                        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'xls': 'application/vnd.ms-excel',
                        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'txt': 'text/plain',
                        'zip': 'application/zip',
                    };
                    return mimeTypes[ext] || 'application/octet-stream';
                };
                
                // 모킹 파일은 텍스트 파일로 다운로드 (실제 파일 형식이 아니므로)
                const blob = new Blob([mockContent], { type: 'text/plain;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                // 파일명에 _mock 추가하여 모킹 파일임을 표시
                const mockFileName = fileName.replace(/\.[^/.]+$/, '') + '_mock.txt';
                a.download = mockFileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                alert('모킹 파일 다운로드 완료 (백엔드 연결 실패)\n참고: 실제 파일이 아닌 모킹 파일입니다.\n파일명: ' + mockFileName);
            } else {
                alert('파일 다운로드에 실패했습니다.');
            }
        }
        closeContextMenu();
    };

    const handleViewInfo = () => {
        closeContextMenu();
        // 기본 동작 (파일 선택)
        onClick();
    };

    const handleRename = () => {
        closeContextMenu();
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
            if (!confirm(`${item.original_name || item.name} 파일을 휴지통으로 이동하시겠습니까?`)) {
                closeContextMenu();
                return;
            }

            const response = await api.delete(`/files/${item.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.code === 'FILE_DELETED') {
                alert('파일이 휴지통으로 이동되었습니다.');
                // 파일 목록 새로고침
                if (onFileDeleted) {
                    onFileDeleted();
                }
            } else {
                throw new Error('파일 삭제 실패');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(`파일 삭제 실패: ${error.response.data.message}`);
            } else {
                alert('파일 삭제에 실패했습니다.');
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
                onClick={onClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                onContextMenu={handleContextMenu}
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
                    {item.name}
                </span>
            
            {/* 메타데이터 */}
                <span className="text-[0.4375rem] md:text-[0.6875rem] text-[#9AA9B9] font-normal text-center truncate w-full max-w-full">
                    {item.count ? `${item.updatedAt} | ${item.count}` : new Date(item.createdAt).toLocaleDateString()}
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
                fileName={item.name}
            />
        </>
    )
}

export default FileItem;
