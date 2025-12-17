import { useState, useEffect } from 'react';
import InputField from "../content/InputField";
import { useModalStore } from '../../../store/store';
import MyButton from '../content/MyButton';
import api from '../../../utils/api';

export default function RenameModal() {
    const { isOpenRenameModal, setIsOpenRenameModal, renameItem, setRenameItem } = useModalStore();
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 모달이 열릴 때 현재 파일 이름으로 초기화
    useEffect(() => {
        if (isOpenRenameModal && renameItem) {
            // 확장자를 제외한 파일 이름만 추출
            const fileName = renameItem.original_name || renameItem.name;
            const lastDotIndex = fileName.lastIndexOf('.');
            
            if (renameItem.mimeType === 'file' && lastDotIndex > 0) {
                // 파일인 경우 확장자 제외
                setNewName(fileName.substring(0, lastDotIndex));
            } else {
                // 폴더이거나 확장자가 없는 경우 전체 이름
                setNewName(fileName);
            }
        }
    }, [isOpenRenameModal, renameItem]);

    const handleClose = () => {
        setIsOpenRenameModal(false);
        setRenameItem(null);
        setNewName('');
    };

    const handleRename = async () => {
        if (!renameItem) return;
        
        // 파일만 처리 (폴더는 나중에)
        if (renameItem.mimeType) {
            alert('현재는 파일 이름만 변경할 수 있습니다.');
            return;
        }

        if (!newName || newName.trim() === '') {
            alert('새로운 이름을 입력해주세요.');
            return;
        }

        // 확장자 추가
        const originalFileName = renameItem.original_name || renameItem.name;
        const lastDotIndex = originalFileName.lastIndexOf('.');
        const extension = lastDotIndex > 0 ? originalFileName.substring(lastDotIndex) : '';
        const fullNewName = newName.trim() + extension;

        // 이름이 변경되지 않았으면 그냥 닫기
        if (fullNewName === originalFileName) {
            handleClose();
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('로그인이 필요합니다.');
                setIsLoading(false);
                return;
            }

            const response = await api.patch(`/files/${renameItem.id}/rename`, {
                newName: fullNewName
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('파일 이름이 변경되었습니다.');
                
                // 파일 목록 새로고침 이벤트 발생
                window.dispatchEvent(new CustomEvent('filesUpdated'));
                
                handleClose();
            }
        } catch (error) {
            console.error('파일 이름 변경 실패:', error);
            if (error.response?.data?.message) {
                alert(`이름 변경 실패: ${error.response.data.message}`);
            } else {
                alert('파일 이름 변경에 실패했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleRename();
        }
    };

    if (!renameItem) return null;

    return (
        <div className={`fixed w-full h-full top-0 left-0 bg-[#00000077] flex justify-center items-center z-100 ${isOpenRenameModal ? '' : 'hidden'}`}>
            <div className="bg-white md:w-[500px] w-[90%] p-6 rounded-[10px] shadow-md">
                <div className="text-[13pt] mb-2">파일 이름 변경</div>
                <div className="text-[9pt] text-gray-500 mb-4">
                    {renameItem.original_name || renameItem.name}
                </div>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="새로운 이름을 입력하세요"
                    className="w-full px-4 md:py-2 py-3 border border-gray-300 rounded-[10px] md:rounded-md focus:outline-none focus:border-blue-500 mb-4"
                    autoFocus
                    disabled={isLoading}
                />
                {/* Buttons */}
                <div className='md:flex md:gap-2 md:justify-end'>
                    <div className='md:w-[250%]'></div>
                    <MyButton
                        value='취소' 
                        type='text' 
                        onClick={handleClose}
                        disabled={isLoading}
                    />
                    <MyButton 
                        value={isLoading ? '변경 중...' : '확인'} 
                        type='gradient' 
                        onClick={handleRename}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}