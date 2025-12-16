import React, { useState, useEffect } from "react";
import api from "../../../utils/api";

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
                const response = await api.get('/disk/usage', { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });

                const { used, total } = response.data.data;
                let percentage = (used / total) * 100;
                setUsageData({
                    used: used,
                    total: total,
                    percentage: Math.min(percentage, 100) // 100% 초과 방지
                });
            }
            catch (error) {
                // 에러 처리 (사용량 데이터 로딩 실패)
            }
            finally { setLoading(false); }
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