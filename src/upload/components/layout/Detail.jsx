import React from "react";
import FolderIcon from "../../../assets/upload/folder_icon.svg";
import EmptyFolderIcon from "../../../assets/upload/empty_folder_icon.svg";
import FileIcon from "../../../assets/upload/file_icon.svg";
import { usePathStore } from "../../../store/store";

function Detail({ selectedItem = null }) {
    const { pathNameHistory, currentPath } = usePathStore();

    // 선택된 아이템이 없으면 빈 상태 표시
    if (!selectedItem) {
        return (
            <div className="hidden md:block md:w-[20.93svw] md:h-auto md:m-3 rounded-[10px] border-[1px] border-[#DAE0E9] bg-white p-6 flex items-center justify-center">
            </div>
        )
    }

    const getItemCount = (count) => {
        if (!count) return 0;
        return parseInt(count.split('개의 항목')[0]);
    };

    const itemCount = getItemCount(selectedItem.count);
    const isEmpty = selectedItem.mime_type === "folder" && itemCount === 0;

    // 전체 경로 생성: pathNameHistory를 '/' 로 연결
    const getFullPath = () => {
        const itemName = selectedItem.original_name || selectedItem.name;
        
        // 선택된 아이템이 현재 폴더인 경우 (폴더 안에 들어갔을 때)
        // pathNameHistory의 마지막 항목과 selectedItem의 이름이 같으면 중복 방지
        const lastPathName = pathNameHistory[pathNameHistory.length - 1];
        
        if (selectedItem.mime_type === "folder" && lastPathName === itemName) {
            // 현재 폴더 자체가 선택된 경우
            return `/${pathNameHistory.join('/')}`;
        } else {
            // 현재 폴더 내의 파일이나 하위 폴더가 선택된 경우
            return `/${pathNameHistory.join('/')}/${itemName}`;
        }
    };

    return (
        <div className="hidden md:block md:w-[20.93svw] scrollbar-hide md:h-auto md:m-3 md:px-[2.65svw] md:pt-28 rounded-[15px] border-[1px] overflow-auto border-[#DAE0E9] bg-white p-6">
            {/* 아이콘 */}
            <div className="flex justify-center mb-6">
                {selectedItem.mime_type === "folder" ? (
                    <img 
                        src={isEmpty ? EmptyFolderIcon : FolderIcon} 
                        alt={selectedItem.mime_type} 
                        className="md:w-[135px] md:h-[101px]"
                    />
                ) : (
                    <div className="rounded-lg flex items-center justify-center">
                        <img src={FileIcon} alt="file" className="md:w-[100px] md:h-[125px]" />
                    </div>
                )}
            </div>
            
            {/* 이름 */}
            <div className="text-center mb-28">
                <h2 className="text-[11pt] font-semibold text-[#34475C]">{selectedItem.name}</h2>
            </div>
            
            {/* 상세 정보 */}
            <div className="space-y-10">
                <div className="flex flex-col justify-left">
                    <span className="text-[9pt] font-semibold text-[#34475C]">유형</span>
                    <span className="text-[9pt] font-normal text-[#667687]">{selectedItem.mime_type === "folder" ? "폴더" : "파일"}</span>
                </div>
                
                {selectedItem.mime_type === "folder" && (
                    <div className="flex flex-col justify-left">
                        <span className="text-[9pt] font-semibold text-[#34475C]">항목 수</span>
                        <span className="text-[9pt] font-normal text-[#667687]">{itemCount}</span>
                    </div>
                )}
                
                <div className="flex flex-col justify-left">
                    <span className="text-[9pt] font-semibold text-[#34475C]">위치</span>
                    <span className="text-[9pt] font-normal text-[#667687] break-all">{getFullPath()}</span>
                </div>
                
                <div className="flex flex-col justify-left">
                    <span className="text-[9pt] font-semibold text-[#34475C]">생성 날짜</span>
                    <span className="text-[9pt] font-normal text-[#667687]">{new Date(selectedItem.createdAt).toLocaleDateString()} 오전 11:02</span>
                </div>
                
                {/* <div className="flex flex-col justify-left">
                    <span className="text-[9pt] font-semibold text-[#34475C]">수정 날짜</span>
                    <span className="text-[9pt] font-normal text-[#667687]">{new Date(selectedItem.updatedAt).toLocaleDateString()} 오후 09:15</span>
                </div> */}
            </div>
        </div>
    )
}

export default Detail;