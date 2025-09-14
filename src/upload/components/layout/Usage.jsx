import React from "react";

function Usage() {
    return (
        <div className="hide md:block md:w-[14.68svw] md:h-[7.87svh] bg-white border-[1px] border-[#DAE0E9] rounded-[10px] md:ml-3 p-4 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[#2A2D41] font-medium text-[0.9375rem]">사용량</span>
                <span className="text-[#989AA9] text-[0.9375rem]">0GB / 2GB</span>
            </div>
            
            <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] rounded-full w-0"></div>
            </div>
        </div>
    )
}

export default Usage;