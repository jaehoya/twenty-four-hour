import React, { useState } from "react";
import Disk_icon from "../../../assets/upload/disk_icon.svg";
import Trashbin_icon from "../../../assets/upload/trashbin_icon.svg";
import Star_icon from "../../../assets/upload/star_icon.svg";

function MobileNavBar() {
    const [activeTab, setActiveTab] = useState('storage');

    const getBarPosition = () => {
        switch(activeTab) {
            case 'storage': return 'left-[16.67%]'; // 첫 번째 버튼 (1/3 지점)
            case 'trash': return 'left-1/2';        // 두 번째 버튼 (중앙)
            case 'favorite': return 'left-[83.33%]'; // 세 번째 버튼 (2/3 지점)
            default: return 'left-1/2';
        }
    };

    return (
        <div className="h-[8.12svh] w-full rounded-[10px] bg-white border-[1px] border-[#DAE0E9] block md:hidden flex flex-row items-center py-6 relative">
            <button 
                className="flex-1 flex flex-col items-center"
                onClick={() => setActiveTab('storage')}
            >
                <img src={Disk_icon} alt="disk_icon" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(8%) saturate(1234%) hue-rotate(184deg) brightness(95%) contrast(89%)' }} />
                <span className="text-[#6D7A91] text-[0.625rem] mt-1">내 저장소</span>
            </button>
            
            <button 
                className="flex-1 flex flex-col items-center border-l border-r border-l-[#DEE7EF] border-r-[#DEE7EF]"
                onClick={() => setActiveTab('trash')}
            >
                <img src={Trashbin_icon} alt="trashbin_icon" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(8%) saturate(1234%) hue-rotate(184deg) brightness(95%) contrast(89%)' }} />
                <span className="text-[#6D7A91] text-[0.625rem] mt-1">휴지통</span>
            </button>
            
            <button 
                className="flex-1 flex flex-col items-center"
                onClick={() => setActiveTab('favorite')}
            >
                <img src={Star_icon} alt="star_icon" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(8%) saturate(1234%) hue-rotate(184deg) brightness(95%) contrast(89%)' }} />
                <span className="text-[#6D7A91] text-[0.625rem] mt-1">즐겨찾기</span>
            </button>
            
            {/* 선택된 상태 표시 바 - 클릭된 버튼 밑에 동적으로 위치 (border 안쪽) */}
            <div className={`absolute bottom-[1px] ${getBarPosition()} transform -translate-x-1/2 w-[9.45svw] h-[0.45svh] bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] rounded-full transition-all duration-300`}></div>
        </div>
    )
}

export default MobileNavBar;