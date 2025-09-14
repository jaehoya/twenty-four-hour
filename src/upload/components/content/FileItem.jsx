import React from "react";
import FolderIcon from "../../../assets/upload/folder_icon.svg";
import EmptyFolderIcon from "../../../assets/upload/empty_folder_icon.svg";
import FileIcon from "../../../assets/upload/file_icon.svg";

function FileItem({ item, isSelected = false, onClick }) {
    // 폴더의 항목 수 확인
    const getItemCount = (count) => {
        if (!count) return 0;
        return parseInt(count.split('개의 항목')[0]);
    };

    const itemCount = getItemCount(item.count);
    const isEmpty = item.type === "folder" && itemCount === 0;

    return (
        <div 
            className={`rounded-[15px] border p-3 md:p-4 flex flex-col md:justify-center items-center cursor-pointer h-[149px] md:h-[229px] min-h-[149px] md:min-h-[229px] ${
                isSelected ? "bg-[#E6F3FF] border-[3px] border-[#1C91FF]" : "bg-white border-gray-200"
            }`}
            onClick={onClick}
        >
            {/* 아이콘 */}
            <div className="flex items-center justify-center h-[65%]">
                {item.type === "folder" ? (
                    <img 
                        src={isEmpty ? EmptyFolderIcon : FolderIcon} 
                        alt="folder" 
                        className="w-[57px] h-[43px] md:w-[135px] md:h-[101px]"
                    />
                ) : (
                    <div className="bg-white flex items-center justify-center relative">
                        <img src={FileIcon} alt="file" className="w-[44px] h-[55px] md:w-[100px] md:h-[125px]" />
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center">
                <div className="h-px w-full max-w-[102px] bg-[#E5EBF2] mb-3 md:hidden" />
            {/* 이름 */}
                <span className="text-[0.6875rem] md:text-[0.875rem] font-semibold text-[#34475C] text-center md:mt-2">
                    {item.name}
                </span>
            
            {/* 메타데이터 */}
                <span className="text-[0.4375rem] md:text-[0.6875rem] text-[#9AA9B9] font-normal text-center">
                    {item.count ? `${item.date} | ${item.count}` : item.date}
                </span>
            </div>
        </div>
    )
}

export default FileItem;
