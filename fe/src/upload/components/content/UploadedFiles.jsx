import React, { useEffect, useState } from "react";
import FileItem from "./FileItem";

function UploadedFiles({ selectedItem, onItemSelect }) {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        const loadUploadedFiles = () => {
            const files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
            setUploadedFiles(files);
        };

        // 초기 로드
        loadUploadedFiles();

        // 파일 업데이트 이벤트 리스너
        const handleFilesUpdate = () => {
            loadUploadedFiles();
        };

        window.addEventListener('filesUpdated', handleFilesUpdate);

        return () => {
            window.removeEventListener('filesUpdated', handleFilesUpdate);
        };
    }, []);

    // 업로드된 파일이 없으면 렌더링하지 않음
    if (uploadedFiles.length === 0) {
        return null;
    }

    return (
        <>
            {uploadedFiles.map((file) => (
                <FileItem 
                    key={file.id} 
                    item={file} 
                    isSelected={selectedItem?.id === file.id}
                    onClick={() => onItemSelect(file)}
                />
            ))}
        </>
    );
}

export default UploadedFiles;
