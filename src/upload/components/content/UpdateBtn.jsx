import React from "react";

function UpdateBtn() {
    return (
        <button className="w-[64px] h-[64px] bg-white rounded-full border-[1px] border-[#DAE0E9] flex items-center justify-center relative shadow-[0_0_15.3px_rgba(104,144,189,0.12)] hover:shadow-[0_0_20px_rgba(104,144,189,0.2)] transition-shadow duration-200">
            <span className="text-[2.5rem] font-normal bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] bg-clip-text text-transparent leading-none flex items-center justify-center">+</span>
        </button>
    )
}

export default UpdateBtn;