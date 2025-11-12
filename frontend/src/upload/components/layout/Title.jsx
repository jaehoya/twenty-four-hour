import React, { useState } from "react";
import Arrow_icon from "../../../assets/upload/arrow_icon.svg";
import { usePathStore } from "../../../store/store";

function Title({ selectedSort = "이름", onSortChange = () => {}, activeTab = "storage" }) {
    const [isSortOpen, setIsSortOpen] = useState(false);

    const { goBack, currentPath, currentPathName, pathNameHistory } = usePathStore();

    // const sortOptions = ["이름", "수정한 날짜", "생성한 날짜"];
    const sortOptions = ["이름", "생성한 날짜"];

    const handleSortClick = () => {
        setIsSortOpen(!isSortOpen);
    };

    const handleSortSelect = (option) => {
        onSortChange(option);
        setIsSortOpen(false);
    };

    // 경로 이름을 "내 저장소 > test > subfolder" 형식으로 생성
    const getDisplayPath = () => {
        // 휴지통이나 즐겨찾기 탭인 경우 탭 이름 표시
        if (activeTab === 'trash') return '휴지통';
        if (activeTab === 'favorite') return '즐겨찾기';
        
        // 저장소 탭인 경우 경로 표시
        return pathNameHistory.join(' > ');
    };

    return (
        <div className="w-full h-[4.57svh] md:h-[7.12svh] bg-white border-[1px] border-[#DAE0E9] rounded-[10px] md:rounded-[15px] flex items-center px-4 py-2 md:px-6 justify-between relative">
            {currentPath !== "root" && activeTab === "storage" && (
                <span onClick={() => { goBack(); }} className="cursor-pointer w-7 scale-y-[1.4] mb-0.5 text-[#777]">&lt;</span>
            )}
            <span className="font-semibold mt-0.5 flex-1 text-[0.81rem] md:text-[12pt] text-[#2A2D41] truncate">{getDisplayPath()}</span>
            <div className="flex flex-row space-x-2">
                <div className="relative">
                    <button 
                        onClick={handleSortClick}
                        className="w-16 h-7 md:w-auto md:h-[30px] flex flex-row items-center justify-center p-1 md:p-2 md:pl-6 rounded-[25px] border-[1px] border-[#C7CFDB] shadow-[0_0_10px_rgba(0,0,0,0.06)]"
                    >
                        <span className="text-xs md:text-[9.5pt] md:mt-0.5 text-[#3C4860] font-normal mr-1 md:mr-3">정렬</span>
                        <img 
                            src={Arrow_icon} 
                            alt="arrow_icon" 
                            className={`w-3 h-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    
                    {isSortOpen && (
                        <div className="absolute top-full right-0 mt-1 w-[160px] bg-white rounded-[10px] z-10 shadow-lg border-[1px] border-[#DAE0E9] overflow-hidden">
                            {sortOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleSortSelect(option)}
                                    className={`w-full px-[15px] py-[10px] text-left text-[9.5pt] font-normal bg-white hover:bg-gray-50 ${
                                        selectedSort === option ? 'text-[#1C91FF]' : 'text-[#364359]'
                                    } ${
                                        option !== sortOptions[sortOptions.length - 1] ? 'border-b-[1px] border-[#E9EDF3]' : ''
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* <button className="w-16 h-7 md:w-auto md:h-[30px] flex flex-row items-center justify-center p-1 md:p-2 md:pl-6 rounded-[25px] border-[1px] border-[#C7CFDB] md:ml-2 shadow-[0_0_10px_rgba(0,0,0,0.06)]">
                    <span className="text-xs md:text-[9.5pt] md:mt-0.5 text-[#3C4860] font-normal mr-1 md:mr-3">필터</span>
                    <img src={Arrow_icon} alt="arrow_icon" className="w-3 h-3"/>
                </button> */}
            </div>
        </div>
    )
}

export default Title;