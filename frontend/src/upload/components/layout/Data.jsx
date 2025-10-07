import React, { useEffect, useState } from "react";
import FileItem from "../content/FileItem";
import AddNewItem from "../content/AddNewItem";
import UploadedFiles from "../content/UploadedFiles";
import api from "../../../utils/api";

function Data({ selectedItem, onItemSelect, isAddNewItemOpen, setIsAddNewItemOpen, onFileUpload }) {
    // // 샘플 데이터
    // const items = [
    //     { id: 1, name: "folder_00", type: "folder", date: "2025/08/26", count: "1개의 항목" },
    //     { id: 2, name: "folder_01", type: "folder", date: "2025/08/26", count: "0개의 항목" },
    //     { id: 3, name: "folder_02", type: "folder", date: "2025/08/26", count: "1개의 항목" },
    //     { id: 4, name: "folder_03", type: "folder", date: "2025/08/26", count: "1개의 항목" },
    //     { id: 5, name: "folder_04", type: "folder", date: "2025/08/26", count: "1개의 항목" },
    //     { id: 6, name: "folder_05", type: "folder", date: "2025/08/26", count: "1개의 항목" },
    //     { id: 7, name: "file_00.txt", type: "file", date: "2025/08/26", count: null },
    //     { id: 8, name: "file_01.jpg", type: "file", date: "2025/08/26", count: null },
    //     { id: 9, name: "file_02.apk", type: "file", date: "2025/08/26", count: null, progress: 45.2 }
    // ];

    const [ files, setFiles ] = useState([]);

    // Fetch Files from API
    useEffect(() => {
        api.get('/files', { params: { search: undefined, sortBy: undefined, sortOrder: undefined } })
        .then((res) => {
            console.log('API 파일 목록:', res.data.files);
            setFiles(res.data.files);
        })
        .catch((err) => {
            console.log('API 호출 실패, 빈 배열로 설정:', err.message);
            setFiles([]); // 에러 시 빈 배열로 설정
        });
    }, []);

    return (
        <div className="w-full h-full rounded-[10px] relative overflow-y-auto scrollbar-hide flex flex-col">
            {/* 반응형 그리드 - 모바일: 3개, 데스크톱: 5개 */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-2 md:gap-x-3 gap-y-1 md:gap-y-3 auto-rows-max">
                {/* 업로드된 파일들 */}
                <UploadedFiles 
                    selectedItem={selectedItem}
                    onItemSelect={onItemSelect}
                />
                {/* FileItem 컴포넌트들 */}
                {files.map((file) => (
                    <FileItem 
                        key={file.id} 
                        item={file} 
                        isSelected={selectedItem?.id === file.id}
                        onClick={() => onItemSelect(file)}
                    />
                ))}
                {/* 새 항목 추가 버튼 */}
                <div className="hidden md:block">
                    <AddNewItem 
                        isAddNewItemOpen={isAddNewItemOpen}
                        setIsAddNewItemOpen={setIsAddNewItemOpen}
                        onFileUpload={onFileUpload}
                    />
                </div>
            </div>
            
        </div>
    )
}

export default Data;