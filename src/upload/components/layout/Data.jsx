import React from "react";
import FileItem from "../content/FileItem";
import AddNewItem from "../content/AddNewItem";

function Data({ selectedItem, onItemSelect }) {
    // 샘플 데이터
    const items = [
        { id: 1, name: "folder_00", type: "folder", date: "2025/08/26", count: "1개의 항목" },
        { id: 2, name: "folder_01", type: "folder", date: "2025/08/26", count: "0개의 항목" },
        { id: 3, name: "folder_02", type: "folder", date: "2025/08/26", count: "1개의 항목" },
        { id: 4, name: "folder_03", type: "folder", date: "2025/08/26", count: "1개의 항목" },
        { id: 5, name: "folder_04", type: "folder", date: "2025/08/26", count: "1개의 항목" },
        { id: 6, name: "folder_05", type: "folder", date: "2025/08/26", count: "1개의 항목" },
        { id: 7, name: "file_00.txt", type: "file", date: "2025/08/26", count: null },
        { id: 8, name: "file_01.jpg", type: "file", date: "2025/08/26", count: null },
        { id: 9, name: "file_02.apk", type: "file", date: "2025/08/26", count: null, progress: 45.2 }
    ];

    return (
        <div className="w-full rounded-[10px] relative mt-2 md:mt-3 overflow-auto">
            {/* 반응형 그리드 - 모바일: 3개, 데스크톱: 5개 */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                {/* FileItem 컴포넌트들 */}
                {items.map((item) => (
                    <FileItem 
                        key={item.id} 
                        item={item} 
                        isSelected={selectedItem?.id === item.id}
                        onClick={() => onItemSelect(item)}
                    />
                ))}
                {/* 새 항목 추가 버튼 */}
                <div className="hidden md:block">
                    <AddNewItem />
                </div>
            </div>
            
        </div>
    )
}

export default Data;