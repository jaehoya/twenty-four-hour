import React from "react";

function AddNewItem() {
    return (
        <div className="relative rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors h-[149px] md:h-[229px] min-h-[149px] md:min-h-[229px]">
            {/* SVG 점선 테두리 */}
            <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                style={{ borderRadius: '15px' }}
            >
                <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="14"
                    ry="14"
                    fill="none"
                    stroke="#BCC3CD"
                    strokeWidth="2"
                    strokeDasharray="5 6"
                />
            </svg>
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <span className="text-2xl md:text-[3.1875rem] font-light text-[#BCC3CD]">+</span>
            </div>
        </div>
    )
}

export default AddNewItem;
