import { useState, useEffect } from 'react';
import MyButton from '../content/MyButton';
import api from '../../../utils/api';

/**
 * 태그 추가 모달
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} onClose - 닫기 핸들러
 * @param {number} fileId - 태그를 추가할 파일 ID
 * @param {function} onTagAdded - 태그 추가 성공 시 콜백
 */
export default function AddTagsModal({ isOpen, onClose, fileId, onTagAdded }) {
    const [tagValue, setTagValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 모달이 닫힐 때 입력값 초기화
    useEffect(() => {
        if (!isOpen) {
            setTagValue('');
        }
    }, [isOpen]);

    const handleClose = () => {
        setTagValue('');
        onClose();
    };

    const handleConfirm = async () => {
        const trimmedTag = tagValue.trim();
        
        if (!trimmedTag) {
            alert('태그를 입력해주세요.');
            return;
        }

        if (!fileId) {
            alert('파일 정보가 없습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post(`/tags/${fileId}`, {
                tag: trimmedTag
            });

            if (response.status === 201) {
                // 태그 추가 성공
                if (onTagAdded) {
                    onTagAdded(response.data.tag);
                }
                handleClose();
            }
        } catch (error) {
            console.error('태그 추가 실패:', error);
            if (error.response?.data?.message) {
                alert(`태그 추가 실패: ${error.response.data.message}`);
            } else {
                alert('태그 추가에 실패했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleConfirm();
        }
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex justify-center items-center z-50"
            onClick={handleClose}
        >
            <div 
                className="bg-white w-[90%] max-w-[400px] p-6 rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 제목 */}
                <h2 className="text-[15px] font-semibold text-[#34475C] mb-4">
                    태그 추가하기
                </h2>

                {/* 입력 필드 */}
                <input
                    type="text"
                    value={tagValue}
                    onChange={(e) => setTagValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="추가할 태그를 입력해주세요."
                    className="w-full px-4 py-3 border border-[#E5EBF2] rounded-[8px] text-[13px] text-[#34475C] placeholder-[#9AA9B9] focus:outline-none focus:border-[#0D4CFF] transition-colors"
                    autoFocus
                    disabled={isLoading}
                />

                {/* 버튼 영역 */}
                <div className="flex gap-2 mt-5">
                    <MyButton
                        value="취소"
                        type="text"
                        onClick={handleClose}
                        disabled={isLoading}
                    />
                    <MyButton
                        value={isLoading ? '추가 중...' : '확인'}
                        type="gradient"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}

