import React from "react";
import { useNavigate } from "react-router-dom";
import Disk_icon from "../../../assets/upload/disk_icon.svg";
import Trashbin_icon from "../../../assets/upload/trashbin_icon.svg";
import Star_icon from "../../../assets/upload/star_icon.svg";

function MobileNavBar({ activeTab, navigate: navigateProp }) {
    const navigateHook = useNavigate();
    const navigate = navigateProp || navigateHook;

    const getBarPosition = () => {
        switch(activeTab) {
            case 'storage': return 'left-[16.67%]';
            case 'trash': return 'left-1/2';
            case 'favorite': return 'left-[83.33%]';
            default: return 'left-1/2';
        }
    };

    return (
        <div className="h-[8.12svh] w-full rounded-[10px] bg-white border-[1px] border-[#DAE0E9] block md:hidden flex flex-row items-center py-6 relative">
            <button 
                className="flex-1 flex flex-col items-center"
                onClick={() => navigate('/upload')}
            >
                <img src={Disk_icon} alt="disk_icon" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(8%) saturate(1234%) hue-rotate(184deg) brightness(95%) contrast(89%)' }} />
                <span className="text-[#6D7A91] text-[0.625rem] mt-1">내 저장소</span>
            </button>
            
            <button 
                className="flex-1 flex flex-col items-center border-l border-r border-l-[#DEE7EF] border-r-[#DEE7EF]"
                onClick={() => navigate('/upload/trash')}
            >
                <img src={Trashbin_icon} alt="trashbin_icon" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(8%) saturate(1234%) hue-rotate(184deg) brightness(95%) contrast(89%)' }} />
                <span className="text-[#6D7A91] text-[0.625rem] mt-1">휴지통</span>
            </button>
            
            <button 
                className="flex-1 flex flex-col items-center"
                onClick={() => navigate('/upload/favorites')}
            >
                <img src={Star_icon} alt="star_icon" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(8%) saturate(1234%) hue-rotate(184deg) brightness(95%) contrast(89%)' }} />
                <span className="text-[#6D7A91] text-[0.625rem] mt-1">즐겨찾기</span>
            </button>
            
            <div className={`absolute bottom-[1px] ${getBarPosition()} transform -translate-x-1/2 w-[9.45svw] h-[0.45svh] bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] rounded-full transition-all duration-300`}></div>
        </div>
    )
}

export default MobileNavBar;
