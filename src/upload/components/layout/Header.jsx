import React from "react";
import Logo from "../../../assets/upload/24_logo.svg";
import SearchBar from "../content/SearchBar";
import Profile from "../content/Profile";
import { useModalStore } from '../../../store/store';

function Header() {
    const {setIsOpenProfileModal} = useModalStore();
    return (
        <div className="w-full h-[7svh] md:h-15 flex flex-row items-center justify-between border-b-[1px] border-b-[#DAE0E9] bg-white px-2 py-2 md:px-[1.97svw] md:pr-[1.5svw] md:py-[1.2svh]">
            <div className="h-full hidden md:flex md:items-center md:mr-2">
                <img src={Logo} className="md:max-h-[24px] w-auto mr-2" alt="logo"/>
                <span className="text-[12pt] font-medium text-[#222]">TFH Storage</span>
            </div>
            
            <div className="flex-1 h-full mr-2 md:flex-none md:w-[33svw] md:ml-28">
                <SearchBar />
            </div>
            <div onClick={() => setIsOpenProfileModal(true)} className="w-[45px] aspect-1 md:w-[57px] md:h-[57px] ml-auto">
                <Profile />
            </div>
        </div>
    )
}

export default Header;