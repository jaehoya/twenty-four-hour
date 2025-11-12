// React
import { useEffect, useState } from 'react';

// Store
import { useModalStore } from '../../../store/store';

// Components
import Usage from './Usage';
import Profile from '../content/Profile';
import MyButton from '../content/MyButton';

// Utils
import api from '../../../utils/api';

export default function ProfileModal() {
    // Store
    const { isOpenProfileModal, setIsOpenProfileModal } = useModalStore();

    // State
    const [ userData, setUserData ] = useState(null);

    // Init
    useEffect(() => {
        api.get('/profile/me')
            .then((res) => {
                setUserData(res.data);
            })
            .catch((err) => { console.error('Error fetching user data:', err); });
    }, []);

    // Handler
    function handleLogout() {
        api.post('/users/logout')
            .then(() => {
                alert('로그아웃 되었습니다.');
                window.location.href = '/login';
            })
            .catch((err) => {
                alert('로그아웃에 실패했습니다.');
                console.error('Logout error:', err);
            });
    }

    return (
        <div className={`${isOpenProfileModal ? '' : 'hidden'} fixed w-full h-full top-0 left-0 bg-[#00000077] flex justify-center items-center z-100`}>
            <div className="bg-white w-[80%] md:w-[400px] p-6 rounded-[10px] shadow-md">
                {/* Profile Image */}
                <div className='flex justify-center mb-2 px-22 md:px-30'>
                    <Profile />
                </div>
                
                {/* Email */}
                <h2 className="text-[11pt] flex justify-center mb-4">
                    {userData?.email || 'unknown'}
                </h2>
                
                {/* Usage */}
                <Usage />
                
                {/* Buttons */}
                <div className='px-0 py-1 md:px-3 flex flex-col gap-1 md:gap-2'>
                    <MyButton value='로그아웃' type='gradient' onClick={() => handleLogout()} />
                    <MyButton value='회원탈퇴' type='flat' />
                    <MyButton value='닫기' type='text' onClick={() => setIsOpenProfileModal(false)} />
                </div>
            </div>
        </div>
    );
}