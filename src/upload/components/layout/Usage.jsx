import React from "react";

function Usage() {
    return (
        <div className="hide md:mr-3 md:mb-3 md:block md:w-auto md:h-18 bg-white border-[1px] border-[#DAE0E9] rounded-[10px] md:ml-3 p-4 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[#2A2D41] font-medium text-[9pt]">사용량</span>
                <span className="text-[#989AA9] text-[9pt]">0GB / 2GB</span>
            </div>
            
            <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] rounded-full w-0"></div>
            </div>
        </div>
    )
}

export default Usage;