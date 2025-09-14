import React, { useState } from "react";
import Arrow_icon from "../../../assets/upload/arrow_icon.svg";

function Title() {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("이름");

    const sortOptions = ["이름", "수정한 날짜", "생성한 날짜"];

    const handleSortClick = () => {
        setIsSortOpen(!isSortOpen);
    };

    const handleSortSelect = (option) => {
        setSelectedSort(option);
        setIsSortOpen(false);
    };

    return (
        <div className="w-full h-[4.57svh] md:h-[7.12svh] bg-white border-[1px] border-[#DAE0E9] rounded-[10px] flex items-center px-4 py-2 md:py-4 md:px-6 justify-between relative">
            <span className="font-semibold text-[0.81rem] md:text-[1.25rem] text-[#2A2D41]">내 저장소</span>
            <div className="flex flex-row space-x-2">
                <div className="relative">
                    <button 
                        onClick={handleSortClick}
                        className="w-16 h-7 md:w-[100px] md:h-[34px] flex flex-row items-center justify-center p-1 md:p-2 md:pl-6 rounded-[25px] border-[1px] border-[#C7CFDB] shadow-[0_0_10px_rgba(0,0,0,0.06)]"
                    >
                        <span className="text-xs md:text-[0.8125rem] text-[#3C4860] font-normal mr-1 md:mr-3">정렬</span>
                        <img 
                            src={Arrow_icon} 
                            alt="arrow_icon" 
                            className={`w-3 h-3 md:mt-1 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    
                    {isSortOpen && (
                        <div className="absolute top-full right-0 mt-1 w-[176px] bg-white rounded-[15px] z-10 shadow-lg border-[1px] border-[#DAE0E9] overflow-hidden">
                            {sortOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleSortSelect(option)}
                                    className={`w-full px-[20px] py-[15px] text-left text-[0.8125rem] font-normal bg-white hover:bg-gray-50 ${
                                        selectedSort === option ? 'text-[#1C91FF] font-semibold' : 'text-[#364359]'
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
                
                <button className="w-16 h-7 md:w-[100px] md:h-[34px] flex flex-row items-center justify-center p-1 md:p-2 md:pl-6 rounded-[25px] border-[1px] border-[#C7CFDB] md:ml-2 shadow-[0_0_10px_rgba(0,0,0,0.06)]">
                    <span className="text-xs md:text-[0.8125rem] text-[#3C4860] font-normal mr-1 md:mr-3">필터</span>
                    <img src={Arrow_icon} alt="arrow_icon" className="w-3 h-3 md:mt-1"/>
                </button>
            </div>
        </div>
    )
}

export default Title;