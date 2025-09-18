import React from "react";
import StorageIcon from "../../../assets/upload/storage_icon.svg";
import TrashIcon from "../../../assets/upload/trash_icon.svg";
import StarIcon from "../../../assets/upload/star_icon.svg";

function BottomNavigation() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
            <div className="flex justify-around items-center py-2">
                {/* 내 저장소 - 활성화된 탭 */}
                <div className="flex flex-col items-center py-2">
                    <img src={StorageIcon} alt="storage" className="w-6 h-6 mb-1" />
                    <span className="text-xs text-blue-600 font-medium">내 저장소</span>
                    <div className="w-8 h-0.5 bg-blue-600 mt-1"></div>
                </div>
                
                {/* 휴지통 */}
                <div className="flex flex-col items-center py-2">
                    <img src={TrashIcon} alt="trash" className="w-6 h-6 mb-1" />
                    <span className="text-xs text-gray-500">휴지통</span>
                </div>
                
                {/* 즐겨찾기 */}
                <div className="flex flex-col items-center py-2">
                    <img src={StarIcon} alt="star" className="w-6 h-6 mb-1" />
                    <span className="text-xs text-gray-500">즐겨찾기</span>
                </div>
            </div>
        </div>
    )
}

export default BottomNavigation;
