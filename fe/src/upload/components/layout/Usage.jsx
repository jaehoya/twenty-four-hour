import React, { useState, useEffect } from "react";
import api from "../../../utils/api";

function Usage() {
    const [usageData, setUsageData] = useState({
        used: 0,
        total: 2,
        percentage: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isFirst = true;

        const fetchUsageData = async () => {
            try {
                // ✅ 최초 1번만 로딩
                if (isFirst) setLoading(true);

                const response = await api.get('/disk/usage');
                const { used, total } = response.data.data;

                const rawPercentage = (used / total) * 100;

                setUsageData({
                    used,
                    total,
                    percentage: Math.min(Math.max(rawPercentage, 0.5), 100),
                });
            } catch (error) {
                console.error(error);
            } finally {
                if (isFirst) {
                    setLoading(false);
                    isFirst = false;
                }
            }
        };

        fetchUsageData(); // 최초
        const interval = setInterval(fetchUsageData, 5000); // silent polling

        return () => clearInterval(interval);
    }, []);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 KB';

        const KB = 1024;
        const MB = KB * 1024;
        const GB = MB * 1024;

        if (bytes >= GB) return `${(bytes / GB).toFixed(1)} GB`;
        if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
        return `${(bytes / KB).toFixed(0)} KB`;
    };

    return (
        <div className="hide md:mr-3 md:mb-3 md:block md:w-auto md:h-18 bg-white border-[1px] border-[#DAE0E9] rounded-[15px] md:ml-3 p-4 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[#2A2D41] font-medium text-[9pt]">사용량</span>
                <span className="text-[#989AA9] text-[9pt]">
                    {loading
                        ? '로딩 중...'
                        : `${formatBytes(usageData.used)} / ${formatBytes(usageData.total)}`
                    }
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
    );
}

export default Usage;
