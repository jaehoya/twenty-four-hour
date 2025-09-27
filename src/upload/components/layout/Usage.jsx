import React, { useState, useEffect } from "react";

function Usage() {
    const [usageData, setUsageData] = useState({
        used: 0,
        total: 2,
        percentage: 0
    });
    const [loading, setLoading] = useState(true);

    // 백엔드에서 사용량 데이터 가져오기
    useEffect(() => {
        const fetchUsageData = async () => {
            try {
                setLoading(true);
                // TODO: 실제 API 엔드포인트로 변경
                const response = await fetch('/api/usage');
                if (response.ok) {
                    const data = await response.json();
                    const percentage = (data.used / data.total) * 100;
                    setUsageData({
                        used: data.used,
                        total: data.total,
                        percentage: Math.min(percentage, 100) // 100% 초과 방지
                    });
                } else {
                    // API 실패 시 기본값 사용
                    console.warn('사용량 데이터를 가져올 수 없습니다. 기본값을 사용합니다.');
                }
            } catch (error) {
                console.error('사용량 데이터 로딩 중 오류:', error);
                // 오류 시 기본값 사용
            } finally {
                setLoading(false);
            }
        };

        fetchUsageData();
    }, []);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0GB';
        const gb = bytes / (1024 * 1024 * 1024);
        return `${gb.toFixed(1)}GB`;
    };

    return (
        <div className="hide md:mr-3 md:mb-3 md:block md:w-auto md:h-18 bg-white border-[1px] border-[#DAE0E9] rounded-[15px] md:ml-3 p-4 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[#2A2D41] font-medium text-[9pt]">사용량</span>
                <span className="text-[#989AA9] text-[9pt]">
                    {loading ? '로딩 중...' : `${formatBytes(usageData.used)} / ${formatBytes(usageData.total)}`}
                </span>
            </div>
            
            <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] rounded-full transition-all duration-500 ease-out"
                    style={{ 
                        width: loading ? '0%' : `${usageData.percentage}%` 
                    }}
                ></div>
            </div>
        </div>
    )
}

export default Usage;