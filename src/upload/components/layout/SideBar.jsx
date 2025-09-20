import React, { useState } from "react";
import Disk_icon from "../../../assets/upload/disk_icon.svg";
import Trashbin_icon from "../../../assets/upload/trashbin_icon.svg";
import Star_icon from "../../../assets/upload/star_icon.svg";

function SideBar() {
    const [activeButton, setActiveButton] = useState("내 저장소");

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const getButtonStyles = (buttonName) => {
        const isActive = activeButton === buttonName;
        return {
            button: `flex flex-row items-center p-4 w-full h-11 rounded-[8px] transition-all duration-300 ease-in-out ${
                isActive 
                    ? "bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF]" 
                    : "hover:bg-gray-50"
            }`,
            text: `font-normal text-[9pt] transition-colors duration-300 ease-in-out ${
                isActive ? "text-[#FFFFFF]" : "text-[#2A2D41]"
            }`,
            icon: `pr-2 w-7 transition-all duration-300 ease-in-out ${
                isActive ? "brightness-0 invert" : ""
            }`
        };
    };

    return (
        <div className="hidden md:block md:h-full bg-white md:m-3 md:p-2 rounded-[10px] border-[1px] border-[#DAE0E9] flex flex-row md:flex-col">
            <button 
                className={getButtonStyles("내 저장소").button}
                onClick={() => handleButtonClick("내 저장소")}
            >
                <img src={Disk_icon} alt="disk_icon" className={getButtonStyles("내 저장소").icon}/>                        
                <span className={getButtonStyles("내 저장소").text}>내 저장소</span>
            </button>
            
            <button 
                className={getButtonStyles("휴지통").button}
                onClick={() => handleButtonClick("휴지통")}
            >
                <img src={Trashbin_icon} alt="trashbin_icon" className={getButtonStyles("휴지통").icon}/>                        
                <span className={getButtonStyles("휴지통").text}>휴지통</span>
            </button>
            
            <button 
                className={getButtonStyles("즐겨찾기").button}
                onClick={() => handleButtonClick("즐겨찾기")}
            >
                <img src={Star_icon} alt="star_icon" className={getButtonStyles("즐겨찾기").icon}/>                        
                <span className={getButtonStyles("즐겨찾기").text}>즐겨찾기</span>
            </button>
        </div>
    )
}

export default SideBar;