import React, { useEffect, useState } from "react";
import FileItem from "../content/FileItem";
import AddNewItem from "../content/AddNewItem";
import UploadedFiles from "../content/UploadedFiles";
import api from "../../../utils/api";

function Data({ selectedItem, onItemSelect, isAddNewItemOpen, setIsAddNewItemOpen, onFileUpload }) {
    const [ files, setFiles ] = useState([]);

    // Fetch Files from API
    useEffect(() => {
        api.get('/files', { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }, params: { search: undefined, sortBy: undefined, sortOrder: undefined } })
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
                    />
                })}
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