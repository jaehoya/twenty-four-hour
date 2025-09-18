import React from "react";
import Banner_bg from "../../../assets/upload/background.svg";

function Banner() {
    return (
        <div className="w-full h-[8.81svh] md:h-[10svh] md:my-3 md:rounded-[10px] flex items-center my-2 md:my-0 justify-center border-[1px] border-[#DAE0E9] overflow-hidden relative">
            <img src={Banner_bg} alt="banner_bg" className="w-full h-full object-cover absolute inset-0" />
        </div>
    )
}

export default Banner;