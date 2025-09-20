import React from "react";

function ProgressCircle({ progress, size = "md" }) {
    const sizeClasses = {
        sm: "w-6 h-6 text-[0.375rem]",
        md: "w-8 h-8 md:w-[34px] md:h-[34px] text-[0.5rem] md:text-[0.75rem]",
        lg: "w-10 h-10 md:w-16 md:h-16 text-[0.625rem] md:text-[1rem]"
    };

    // 부채꼴 각도 계산 (0도에서 시작하여 시계방향으로)
    const angle = (progress / 100) * 360;
    const radius = 15.9155;
    const centerX = 18;
    const centerY = 18;
    
    // 부채꼴 경로 생성
    const createSectorPath = (startAngle, endAngle) => {
        const start = polarToCartesian(centerX, centerY, radius, endAngle);
        const end = polarToCartesian(centerX, centerY, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        
        return [
            "M", centerX, centerY,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    };
    
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={`relative ${sizeClasses[size]}`}>
                {/* 배경 원 */}
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle
                        className="text-[#007FF6]"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="15.9155"
                    />
                    {/* 진행률 부채꼴 */}
                    {progress > 0 && (
                        <path
                            d={createSectorPath(0, angle)}
                            fill="#007FF6"
                            opacity="1"
                        />
                    )}
                </svg>
                {/* 진행률 텍스트 */}
                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2">
                    <span className={`font-normal text-[#566879] ${sizeClasses[size].split(' ')[2]}`}>
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ProgressCircle;
