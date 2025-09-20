import React from "react";
import FolderIcon from "../../../assets/upload/folder_icon.svg";
import EmptyFolderIcon from "../../../assets/upload/empty_folder_icon.svg";
import FileIcon from "../../../assets/upload/file_icon.svg";
import ProgressCircle from "./ProgressCircle";

function FileItem({ item, isSelected = false, onClick }) {
    // 폴더의 항목 수 확인
    const getItemCount = (count) => {
        if (!count) return 0;
        return parseInt(count.split('개의 항목')[0]);
    };

    const itemCount = (item.count) ? getItemCount(item.id) : 0;
    const isEmpty = item.mime_type === "folder" && itemCount === 0;

    return (
        <div 
            className={`rounded-[15px] p-3 md:p-4 flex flex-col md:justify-center items-center cursor-pointer h-[149px] md:h-[229px] min-h-[149px] md:min-h-[229px] relative z-0 ${
                isSelected ? "bg-[#E6F3FF] border-[#1C91FF] border-[3px]" : "bg-white border-gray-200 border-[1px]"
            }`}
            onClick={onClick}
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
                    {item.original_name}
                </span>
            
            {/* 메타데이터 */}
                <span className="text-[0.4375rem] md:text-[0.6875rem] text-[#9AA9B9] font-normal text-center truncate w-full max-w-full">
                    {item.count ? `${item.updatedAt} | ${item.count}` : new Date(item.updatedAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    )
}

export default FileItem;
