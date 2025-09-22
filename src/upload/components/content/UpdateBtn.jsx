import React, { useRef } from "react";

function UpdateBtn({ onFileSelect }) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (onFileSelect) {
            // 파일 선택 다이얼로그 열기
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0 && onFileSelect) {
            onFileSelect(files);
        }
        // 파일 선택 후 input 초기화
        e.target.value = '';
    };

    return (
        <>
            <input
                ref={fileInputRef}
                id="mobile-file-upload"
                name="mobile-file-upload"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
            />
            <button 
                onClick={handleClick}
                className="w-[64px] h-[64px] bg-white rounded-full border-[1px] border-[#DAE0E9] flex items-center justify-center relative shadow-[0_0_15.3px_rgba(104,144,189,0.12)] hover:shadow-[0_0_20px_rgba(104,144,189,0.2)] transition-shadow duration-200"
            >
                <span className="text-[2.5rem] font-normal bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] bg-clip-text text-transparent leading-none flex items-center justify-center">+</span>
            </button>
        </>
    )
}

export default UpdateBtn;