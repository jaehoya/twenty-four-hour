import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import SideBar from "../components/layout/SideBar";
import Usage from "../components/layout/Usage";
import Banner from "../components/layout/Banner";
import Title from "../components/layout/Title";
import Detail from "../components/layout/Detail";
import MobileNavBar from "../components/layout/MobileNavBar";
import UpdateBtn from "../components/content/UpdateBtn";
import api from "../../utils/api";
import ProfileModal from "../components/layout/ProfileModal";
import RenameModal from "../components/layout/RenameModal";
import WithdrawModal from "../components/layout/WithdrawModal";

function Upload() {
    const [isMobile, setIsMobile] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAddNewItemOpen, setIsAddNewItemOpen] = useState(false);
    const [sortOption, setSortOption] = useState('이름');
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    
    // 현재 경로에서 activeTab 결정
    const getActiveTab = () => {
        if (location.pathname.includes('/favorites')) return 'favorite';
        if (location.pathname.includes('/trash')) return 'trash';
        return 'storage';
    };
    
    const activeTab = getActiveTab();

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);


    // 파일 업로드 함수
    const uploadFiles = async (files, folderId = null) => {
        try {
            // files를 배열로 변환하여 복사본 생성
            const filesArray = Array.from(files);
            
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            const successfulUploads = [];
            const failedUploads = [];
            
            for (let i = 0; i < filesArray.length; i++) {
                const file = filesArray[i];
                const formData = new FormData();
                formData.append('file', file);
                
                // folderId가 제공된 경우에만 추가
                if (folderId !== null && folderId !== undefined) {
                    formData.append('folderId', folderId);
                }
                
                try {
                    // 실제 API 호출
                    const response = await api.post('/files/upload', formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            // Content-Type은 FormData일 때 자동으로 설정되므로 명시하지 않음 (한글 파일명 지원)
                        },
                    });
                    
                    // API 응답이 성공인 경우 (201 상태 코드)
                    if (response.status === 201 && response.data.state === 201) {
                        // 성공한 파일 정보를 저장
                        const uploadedFile = {
                            id: response.data.file.id,
                            name: response.data.file.original_name,
                            original_name: response.data.file.original_name,
                            stored_name: response.data.file.stored_name,
                            mime_type: response.data.file.mime_type,
                            size: response.data.file.size,
                            path: response.data.file.path,
                            createdAt: response.data.file.createdAt,
                            updatedAt: response.data.file.updatedAt,
                            count: null
                        };
                        
                        successfulUploads.push(uploadedFile);
                    }
                } catch (apiError) {
                    // API 에러 응답이 있는 경우 (400, 401, 403 등)
                    if (apiError.response?.data) {
                        const errorData = apiError.response.data;
                        
                        // 실패한 파일 정보 저장
                        failedUploads.push({
                            fileName: file.name,
                            error: errorData.message || '알 수 없는 오류',
                            code: errorData.code
                        });
                        
                        // 에러 발생 시 해당 파일 건너뛰고 다음 파일 처리
                        continue;
                    }
                    
                    // 네트워크 에러나 기타 에러
                    failedUploads.push({
                        fileName: file.name,
                        error: '업로드 중 오류가 발생했습니다.',
                    });
                }
            }
            
            // 업로드 완료 후 파일 목록 새로고침
            if (successfulUploads.length > 0) {
                // 파일 목록 새로고침 이벤트 발생
                window.dispatchEvent(new CustomEvent('filesUpdated', { detail: { files: successfulUploads } }));
                
                // 약간의 지연 후 다시 한 번 이벤트 발생 (확실하게)
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('filesUpdated', { detail: { files: successfulUploads } }));
                }, 300);
            }
            
            // 업로드 결과 요약 표시
            if (successfulUploads.length > 0 && failedUploads.length > 0) {
                const successCount = successfulUploads.length;
                const failCount = failedUploads.length;
                alert(`업로드 완료: ${successCount}개 성공, ${failCount}개 실패\n\n실패한 파일들:\n${failedUploads.map(f => `- ${f.fileName}: ${f.error}`).join('\n')}`);
            } else if (successfulUploads.length > 0) {
                alert(`${successfulUploads.length}개 파일이 성공적으로 업로드되었습니다.`);
            } else if (failedUploads.length > 0) {
                alert(`파일 업로드에 실패했습니다.\n\n${failedUploads.map(f => `- ${f.fileName}: ${f.error}`).join('\n')}`);
            }
            
        } catch (error) {
            console.error('파일 업로드 오류:', error);
            alert('파일 업로드에 실패했습니다.');
        }
    };

    // 모바일에서 파일 선택 핸들러
    const handleMobileFileSelect = (files, folderId = null) => {
        uploadFiles(files, folderId);
    };



    // 전체 페이지 드래그앤드롭 핸들러 (storage 탭에서만 작동)
    const handleGlobalDragOver = (e) => {
        if (activeTab !== 'storage') return;
        e.preventDefault();
        e.stopPropagation();
    };

    const handleGlobalDragLeave = (e) => {
        if (activeTab !== 'storage') return;
        e.preventDefault();
        e.stopPropagation();
    };

    const handleGlobalDrop = async (e) => {
        if (activeTab !== 'storage') return;
        e.preventDefault();
        e.stopPropagation();
        
        const files = e.dataTransfer.files;
        if (files.length === 0) return;
        
        // 모달이 열려있으면 닫기
        if (isAddNewItemOpen) {
            setIsAddNewItemOpen(false);
        }
        
        // 파일 업로드 시작
        uploadFiles(files, null);
    };

    return (
        <div 
            className="h-screen bg-[#EFF3FA] flex flex-col"
            onDragOver={handleGlobalDragOver}
            onDragLeave={handleGlobalDragLeave}
            onDrop={handleGlobalDrop}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <ProfileModal />
            <RenameModal />
            <WithdrawModal />

            <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div className="flex flex-col md:flex-row flex-1 relative z-10 overflow-hidden">
                {/* 데스크톱 사이드바 */}
                <div className="hidden md:flex md:w-60 md:flex-col md:h-full">
                    <SideBar activeTab={activeTab} navigate={navigate} />
                    <Usage />
                </div>
                
                {/* 메인 콘텐츠 영역 */}
                <div className="flex flex-col flex-1 relative md:h-full">
                    <div className="mx-2 md:mx-0 flex-1 flex flex-col  md:h-full">
                        <Banner />
                        <Title selectedSort={sortOption} onSortChange={setSortOption} activeTab={activeTab} />
                        <Outlet context={{ 
                            selectedItem, 
                            onItemSelect: setSelectedItem,
                            isAddNewItemOpen,
                            setIsAddNewItemOpen,
                            onFileUpload: uploadFiles,
                            sortOption,
                            setSortOption,
                            searchQuery
                        }} />
                    </div>
                    
                    {/* 24 로고 */}
                    <div className="absolute bottom-10 md:bottom-28 left-1/2 transform -translate-x-1/2 pointer-events-none -z-10">
                        <svg 
                            className="w-[70px] h-[56px] md:w-[132px] md:h-[106px]"
                            viewBox="0 0 82 65" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M36.6074 27.1185C33.1333 27.1185 30.1157 24.5869 29.6593 21.1112C29.402 19.4449 28.0376 13.7738 21.8179 13.7738C15.5982 13.7738 14.2314 19.4449 13.9643 21.1827C13.3865 24.9134 9.85668 27.538 6.04521 27.0065C2.2386 26.482 -0.434285 23.0898 0.0585359 19.3472C0.939786 12.6558 6.62057 0 21.8155 0C37.0104 0 42.6912 12.6558 43.5724 19.3472C44.0676 23.1208 41.3559 26.5726 37.5129 27.0613C37.2094 27.0994 36.906 27.1185 36.6049 27.1185H36.6074Z" 
                                stroke="#C1CAE0" 
                                strokeWidth="1" 
                                fill="none"
                            />
                            <path 
                                d="M36.6168 64.9976H7.01601C4.34556 64.9976 1.90573 63.5077 0.725876 61.1573C-0.456408 58.8068 -0.174796 55.9986 1.45175 53.9175L31.0501 16.036C33.4098 13.0181 37.8137 12.4531 40.8847 14.7631C43.9581 17.0802 44.5383 21.4021 42.1811 24.42L21.2398 51.2214H36.6168C40.4914 51.2214 43.6304 54.3037 43.6304 58.1083C43.6304 61.9129 40.4914 64.9952 36.6168 64.9952V64.9976Z" 
                                stroke="#C1CAE0" 
                                strokeWidth="1" 
                                fill="none"
                            />
                            <path 
                                d="M36.612 65C35.5778 65 34.529 64.7735 33.5385 64.2991C30.0572 62.6305 28.6152 58.5064 30.3146 55.088L55.7907 3.86418C57.223 0.98451 60.4883 -0.545911 63.6734 0.17639C66.8537 0.898692 69.1066 3.68063 69.1066 6.88688V47.6266C69.1066 51.4312 65.9676 54.5135 62.093 54.5135C58.2184 54.5135 55.0794 51.4312 55.0794 47.6266V36.6848L42.9191 61.131C41.7028 63.5745 39.2072 65 36.612 65Z" 
                                stroke="#C1CAE0" 
                                strokeWidth="1" 
                                fill="none"
                            />
                            <path 
                                d="M74.9864 54.5135H62.0929C58.2183 54.5135 55.0793 51.4312 55.0793 47.6266C55.0793 43.822 58.2183 40.7397 62.0929 40.7397H74.9864C78.861 40.7397 82 43.822 82 47.6266C82 51.4312 78.861 54.5135 74.9864 54.5135Z" 
                                stroke="#C1CAE0" 
                                strokeWidth="1" 
                                fill="none"
                            />
                        </svg>
                    </div>
                </div>
                
                {/* 상세 정보 (데스크톱 + 모바일 모달) */}
                <Detail selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />
                
                
            </div>
            
            {/* 모바일 플로팅 액션 버튼 */}
            {isMobile && (
                <div className={`fixed bottom-28 right-6 z-50 transition-opacity duration-200 ${
                    selectedItem ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                    <UpdateBtn onFileSelect={handleMobileFileSelect} />
                </div>
            )}
            
            {/* 모바일 하단 네비게이션 - 모바일에서만 렌더링 */}
            {isMobile && 
            <div className="mx-2 mb-2">
                <MobileNavBar activeTab={activeTab} navigate={navigate} />
            </div>}
            
            
        </div>
    )
}

export default Upload;