// React
import { useState } from 'react';

// Store
import { useModalStore } from '../../../store/store';

// Components
import MyButton from '../content/MyButton';

// Utils
import api from '../../../utils/api';

export default function WithdrawModal() {
    // Store
    const { isOpenWithdrawModal, setIsOpenWithdrawModal, isOpenProfileModal, setIsOpenProfileModal } = useModalStore();

    // State
    const [withdrawPassword, setWithdrawPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setIsOpenWithdrawModal(false);
        setWithdrawPassword('');
    };

    const handleWithdraw = async () => {
        if (!withdrawPassword || withdrawPassword.trim() === '') {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            handleClose();
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.delete('/users/delete', {
                data: {
                    password: withdrawPassword
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('회원탈퇴가 완료되었습니다.');
                localStorage.removeItem('accessToken');
                handleClose();
                setIsOpenProfileModal(false);
                window.location.href = '/login';
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    if (err.response.data?.code === 'INVALID_PASSWORD') {
                        alert('비밀번호가 일치하지 않습니다.');
                    } else {
                        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
                        localStorage.removeItem('accessToken');
                        handleClose();
                        setIsOpenProfileModal(false);
                        window.location.href = '/login';
                    }
                } else {
                    const msg = err.response.data?.message || '회원탈퇴에 실패했습니다.';
                    alert(msg);
                }
            } else {
                alert('회원탈퇴에 실패했습니다.');
            }
            console.error('Withdraw error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpenWithdrawModal) return null;

    return (
        <div className="fixed w-full h-full top-0 left-0 bg-[#00000010] flex justify-center items-center z-[110]">
            <div className="bg-white w-[40%] md:w-[330px] p-6 rounded-[10px] shadow-md">
                {/* Title */}
                <div className="w-full flex flex-col justify-center items-center mb-4">
                    <h2 className="text-[13pt] font-medium text-center text-[#2A2D41] mb-1">회원 탈퇴</h2>
                    <p className="text-[9pt] text-[#A1A5BC] text-center font-regular">
                        회원 탈퇴를 위해 비밀번호 확인이 필요합니다.
                    </p>
                </div>

                {/* Password Input */}
                <div className='px-0 py-1 md:px-3 mb-2'>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={withdrawPassword}
                        onChange={(e) => setWithdrawPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full h-[45px] px-3 border border-[#DAE0E9] rounded-[7px] text-[10pt] text-center outline-none focus:border-[#3888FF] focus:ring-2 focus:ring-[#3888FF] disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-center"
                    />
                </div>
                
                {/* Buttons */}
                <div className='px-0 py-1 md:px-3 flex flex-col gap-1 md:gap-2'>
                    <MyButton 
                        value={isLoading ? '처리 중...' : '탈퇴하기'} 
                        type='flat' 
                        onClick={handleWithdraw}
                        disabled={isLoading}
                        className="!border-red-500 !text-red-500 hover:!bg-red-50"
                    />
                    <MyButton 
                        value='취소' 
                        type='text' 
                        onClick={handleClose}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}

