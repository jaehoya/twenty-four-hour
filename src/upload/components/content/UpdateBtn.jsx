import React from "react";

function UpdateBtn() {
    return (
        <button className="w-[64px] h-[64px] bg-white rounded-full border-[1px] border-[#DAE0E9] flex items-center justify-center relative shadow-[0_0_15.3px_rgba(104,144,189,0.12)]">
            <span className="text-[2.5rem] font-regular bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] bg-clip-text text-transparent absolute top-[calc(50%-2px)] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-0 m-0 leading-none h-[2.5rem] flex items-center justify-center">+</span>
        </button>
    )
}

export default UpdateBtn;