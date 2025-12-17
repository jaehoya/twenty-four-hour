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

        if (!newName || newName.trim() === '') {
            alert('새로운 이름을 입력해주세요.');
            return;
        }

        const originalName = renameItem.original_name || renameItem.name;
        const isFolder = renameItem.mimeType === 'folder' || renameItem.mime_type === 'folder';
        
        let fullNewName;
        if (isFolder) {
            // 폴더인 경우 확장자 없이 그대로 사용
            fullNewName = newName.trim();
        } else {
            // 파일인 경우 확장자 추가
            const lastDotIndex = originalName.lastIndexOf('.');
            const extension = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : '';
            fullNewName = newName.trim() + extension;
        }

        // 이름이 변경되지 않았으면 그냥 닫기
        if (fullNewName === originalName) {
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

            let response;
            if (isFolder) {
                // 폴더 이름 변경
                response = await api.put(`/folders/${renameItem.id}/rename`, {
                    newName: fullNewName
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            } else {
                // 파일 이름 변경
                response = await api.patch(`/files/${renameItem.id}/rename`, {
                    newName: fullNewName
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }

            if (response.status === 200) {
                alert(`${isFolder ? '폴더' : '파일'} 이름이 변경되었습니다.`);
                
                // 파일/폴더 목록 새로고침 이벤트 발생
                window.dispatchEvent(new CustomEvent('filesUpdated'));
                window.dispatchEvent(new CustomEvent('foldersUpdated'));
                
                handleClose();
            }
        } catch (error) {
            console.error(`${isFolder ? '폴더' : '파일'} 이름 변경 실패:`, error);
            if (error.response?.data?.message) {
                alert(`이름 변경 실패: ${error.response.data.message}`);
            } else {
                alert(`${isFolder ? '폴더' : '파일'} 이름 변경에 실패했습니다.`);
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

    const isFolder = renameItem.mimeType === 'folder' || renameItem.mime_type === 'folder';

    return (
        <div className={`fixed w-full h-full top-0 left-0 bg-[#00000077] flex justify-center items-center z-100 ${isOpenRenameModal ? '' : 'hidden'}`}>
            <div className="bg-white md:w-[500px] w-[90%] p-6 rounded-[10px] shadow-md">
                <div className="text-[13pt] mb-2">{isFolder ? '폴더' : '파일'} 이름 변경</div>
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