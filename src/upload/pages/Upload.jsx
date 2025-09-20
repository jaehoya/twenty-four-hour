import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import SideBar from "../components/layout/SideBar";
import Usage from "../components/layout/Usage";
import Banner from "../components/layout/Banner";
import Title from "../components/layout/Title";
import Data from "../components/layout/Data";
import Detail from "../components/layout/Detail";
import MobileNavBar from "../components/layout/MobileNavBar";
import UpdateBtn from "../components/content/UpdateBtn";
import api from "../../utils/api";

function Upload() {
    const [isMobile, setIsMobile] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAddNewItemOpen, setIsAddNewItemOpen] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);


    // 파일 업로드 함수
    const uploadFiles = async (files) => {
        console.log('uploadFiles 함수 시작:', files?.length, '개 파일');
        try {
            // files를 배열로 변환하여 복사본 생성
            const filesArray = Array.from(files);
            console.log('filesArray:', filesArray);
            
            for (let i = 0; i < filesArray.length; i++) {
                const file = filesArray[i];
                const formData = new FormData();
                formData.append('file', file);
                
                // 토큰 확인
                const token = localStorage.getItem('accessToken');
                
                if (token) {
                    try {
                        // 실제 API 호출
                        console.log('API 호출 시도:', '/files/upload');
                        console.log('토큰:', token.substring(0, 20) + '...');
                        console.log('파일 정보:', file.name, file.size, file.type);
                        
                        const response = await api.post('/files/upload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token}`,
                            },
                        });
                        
                        console.log('API 호출 성공:', response.data);
                    } catch (apiError) {
                        // API가 준비되지 않은 경우 시뮬레이션
                        console.error('API 호출 실패:', apiError.message);
                        console.error('상태 코드:', apiError.response?.status);
                        console.error('에러 데이터:', apiError.response?.data);
                        console.log('시뮬레이션 모드로 진행');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } else {
                    // 토큰이 없는 경우 시뮬레이션 모드
                    console.log('토큰이 없음, 시뮬레이션 모드로 진행');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // 업로드된 파일들을 localStorage에 저장
            console.log('localStorage 저장 시작');
            console.log('전달받은 files:', files);
            console.log('files.length:', files.length);
            console.log('Array.from(files):', Array.from(files));
            const uploadedFiles = filesArray.map((file, index) => ({
                id: Date.now() + index,
                name: file.name,
                original_name: file.name,
                mime_type: file.type.startsWith('image/') ? 'image' : 'file',
                size: file.size,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                count: null,
                progress: 0
            }));
            
            console.log('생성된 uploadedFiles:', uploadedFiles);
            
            // 기존 파일 목록에 새 파일들 추가
            const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
            const updatedFiles = [...existingFiles, ...uploadedFiles];
            console.log('기존 파일:', existingFiles.length, '개, 새 파일:', uploadedFiles.length, '개');
            
            // 진행률을 부드럽게 증가시키면서 localStorage에 저장
            const updateProgress = async () => {
                const duration = 3000; 
                const steps = 60; 
                const stepDuration = duration / steps;
                
                for (let step = 0; step <= steps; step++) {
                    const progress = Math.round((step / steps) * 100);
                    
                    const filesWithProgress = updatedFiles.map(file => {
                        const isNewFile = uploadedFiles.some(newFile => newFile.id === file.id);
                        
                        if (isNewFile) {
                            return { ...file, progress: progress };
                        } else {
                            return file;
                        }
                    });
                    
                    localStorage.setItem('uploadedFiles', JSON.stringify(filesWithProgress));
                    window.dispatchEvent(new CustomEvent('filesUpdated'));
                    
                    if (step < steps) {
                        await new Promise(resolve => setTimeout(resolve, stepDuration));
                    }
                }
                
                // 100% 완료 후 progress 속성 제거
                const finalFiles = updatedFiles.map(file => {
                    const isNewFile = uploadedFiles.some(newFile => newFile.id === file.id);
                    
                    if (isNewFile) {
                        const { progress, ...fileWithoutProgress } = file;
                        return fileWithoutProgress;
                    } else {
                        return file;
                    }
                });
                
                localStorage.setItem('uploadedFiles', JSON.stringify(finalFiles));
                window.dispatchEvent(new CustomEvent('filesUpdated'));
                console.log('파일 업로드 완료, filesUpdated 이벤트 발생');
            };
            
            console.log('updateProgress 함수 시작');
            updateProgress();
            
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            // 시뮬레이션 모드에서는 에러 알림을 표시하지 않음
            if (error.message !== 'Network Error') {
                alert('파일 업로드에 실패했습니다.');
            }
        }
    };

    // 모바일에서 파일 선택 핸들러
    const handleMobileFileSelect = (files) => {
        console.log('handleMobileFileSelect 호출됨:', files);
        console.log('files 타입:', typeof files);
        console.log('files.length:', files?.length);
        uploadFiles(files);
    };

    return (
        <div className="h-screen bg-[#EFF3FA] flex flex-col">
            
            <Header />
            <div className="flex flex-col md:flex-row flex-1 relative z-10 overflow-hidden">
                {/* 데스크톱 사이드바 */}
                <div className="hidden md:flex md:w-60 md:flex-col md:h-full">
                    <SideBar />
                    <Usage />
                </div>
                
                {/* 메인 콘텐츠 영역 */}
                <div className="flex flex-col flex-1 relative md:h-full">
                    <div className="mx-2 md:mx-0 flex-1 flex flex-col  md:h-full">
                        <Banner />
                        <Title />
                        <div className={`flex-1 flex flex-col mt-2 md:mt-3 mb-2 md:mb-3 rounded-[15px] transition-all duration-300 relative min-h-0 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-180px)] ${isAddNewItemOpen ? 'bg-[#A4CFFF]/22 backdrop-blur-[20px] relative z-10' : ''}`}>
                            <Data 
                                selectedItem={selectedItem} 
                                onItemSelect={setSelectedItem}
                                isAddNewItemOpen={isAddNewItemOpen}
                                setIsAddNewItemOpen={setIsAddNewItemOpen}
                                onFileUpload={uploadFiles}
                            />
                        </div>
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
                
                {/* 데스크톱 상세 정보 */}
                <Detail selectedItem={selectedItem} />
                
            </div>
            
            {/* 모바일 플로팅 액션 버튼 */}
            {isMobile && (
                <div className="fixed bottom-28 right-6 z-50">
                    <UpdateBtn onFileSelect={handleMobileFileSelect} />
                </div>
            )}
            
            {/* 모바일 하단 네비게이션 - 모바일에서만 렌더링 */}
            {isMobile && 
            <div className="mx-2 mb-2">
                <MobileNavBar />
            </div>}
            
        </div>
    )
}

export default Upload;