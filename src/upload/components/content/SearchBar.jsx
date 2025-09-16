import React from "react";
import SearchIcon from "../../../assets/upload/search_icon.svg";

function SearchBar() {
    return (
        <div className="w-full h-full flex flex-row items-center justify-center border-[1px] border-[#BDD0E6] p-4 rounded-[30px] bg-white md:bg-[#F3F5F9]">
            <img src={SearchIcon} alt="search" className="w-4 h-4 md:w-6 md:h-6 m-2"/>
            <input type="text" placeholder="검색" className="w-full text-[1rem] text-[#989AA9] md:bg-[#F3F5F9] focus:outline-none focus:border-none"/>
        </div>
    )
}

export default SearchBar;