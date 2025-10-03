import Usage from './Usage';
import Profile from '../content/Profile';
import api from '../../../utils/api';
import { useModalStore } from '../../../store/store';

export default function ProfileModal() {
    const {isOpenProfileModal, setIsOpenProfileModal} = useModalStore();

    // type: 'gradient' | 'flat' | 'text'
    function MyButton({ value = '버튼', type = 'flat', onClick = () => {} }) {
        return (
            <button
                onClick={onClick}
                className={`block w-full h-[45px] mx-auto rounded-[7px] text-sm md:text-sm
                    ${(type === 'gradient') ? 'bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] shadow-lg text-white' : 'text-black'}
                    ${(type === 'flat') && 'border-[1px] border-[#DAE0E9] text-[#222]'}
                    ${(type === 'text') && 'underline'}
                    `}
            >{value}</button>
        );
    }

    function logout() {
        api.post('/user/logout')
            .then((res) => {
                alert('로그아웃 되었습니다.');
                window.location.href = '/login';
            })
            .catch((err) => {
                alert('로그아웃에 실패했습니다.');
                console.error('Logout error:', err);
            });
    }

    return (
        <div className={`fixed w-full h-full top-0 left-0 bg-[#00000077] flex justify-center items-center z-50 ${isOpenProfileModal ? '' : 'hidden'}`}>
            <div className="bg-white w-[400px] p-6 rounded-[10px] shadow-md">
                {/* Profile Image */}
                <div className='flex justify-center mb-2 px-30'>
                    <Profile />
                </div>
                {/* Email */}
                <h2 className="text-[11pt] flex justify-center mb-4">sample1234@email.com</h2>
                {/* Usage */}
                <Usage />
                {/* Buttons */}
                <div className='px-3 flex flex-col gap-2'>
                    <MyButton value='로그아웃' type='gradient' onClick={() => logout()} />
                    <MyButton value='회원탈퇴' type='flat' />
                    <MyButton value='닫기' type='text' onClick={() => setIsOpenProfileModal(false)} />
                </div>
            </div>
        </div>
    );
}