// React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Store
import { useModalStore } from '../../../store/store';

// Components
import Usage from './Usage';
import Profile from '../content/Profile';
import MyButton from '../content/MyButton';

// Utils
import api from '../../../utils/api';

export default function ProfileModal() {
    // Username update handler
    async function handleUsernameUpdate() {
        if (!editedUsername || editedUsername === userData?.username) {
            setIsEditingUsername(false);
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');
            const res = await api.put('/profile/me', { username: editedUsername }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUserData(res.data);
            setIsEditingUsername(false);
        } catch (err) {
            alert('이름 수정에 실패했습니다.');
            console.error('Username update error:', err);
        }
    }
    // Store
    const { isOpenProfileModal, setIsOpenProfileModal } = useModalStore();

    // State
    const [ userData, setUserData ] = useState(null);
    const [ profileImageUrl, setProfileImageUrl ] = useState(null);
    const [ isEditingUsername, setIsEditingUsername ] = useState(false);
    const [ editedUsername, setEditedUsername ] = useState('');

    // Init
    useEffect(() => {
        if (isOpenProfileModal) {
            fetchUserData();
        }
    }, [isOpenProfileModal]);

    const fetchUserData = () => {
        api.get('/profile/me')
            .then((res) => {
                setUserData(res.data);
                if (res.data?.UserProfile?.ProfileImage?.path) {
                    const baseURL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/api';
                    const imagePath = res.data.UserProfile.ProfileImage.path;
                    const imageUrl = imagePath.startsWith('http') 
                        ? imagePath 
                        : `${baseURL.replace('/api', '')}/${imagePath}`;
                    setProfileImageUrl(imageUrl);
                }
            })
            .catch((err) => { console.error('Error fetching user data:', err); });
    };

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

    // Navigate
    const navigate = useNavigate();
    function ResetPassword() {
        setIsOpenProfileModal(false);
        navigate('/reset-password');
    }

    function handleWithdraw() {
        // 확인 알림창
        if (!confirm('정말 회원탈퇴를 하시겠습니까?\n탈퇴 후에는 복원할 수 없습니다.')) {
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        api.delete('/users/delete', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(() => {
                alert('회원탈퇴가 완료되었습니다.');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.status === 401) {
                        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
                        localStorage.removeItem('accessToken');
                        window.location.href = '/login';
                    } else {
                        const msg = err.response.data?.message || '회원탈퇴에 실패했습니다.';
                        alert(msg);
                    }
                } else {
                    alert('회원탈퇴에 실패했습니다.');
                }
                console.error('Withdraw error:', err);
            });
    }

    const handleImageUpdate = (newImageUrl) => {
        setProfileImageUrl(newImageUrl);
        // 사용자 데이터도 새로고침
        fetchUserData();
    };

    return (
        <div className={`${isOpenProfileModal ? '' : 'hidden'} fixed w-full h-full top-0 left-0 bg-[#00000077] flex justify-center items-center z-100`}>
            <div className="bg-white w-[80%] md:w-[400px] p-6 rounded-[10px] shadow-md">
                {/* Profile Image */}
                <div className='flex justify-center mb-2 px-22 md:px-30'>
                    <Profile editable={true} onImageUpdate={handleImageUpdate} />
                </div>

                {/* Username and Email */}
                <div className="w-full flex flex-col justify-center items-center relative" style={{ minHeight: '32px' }}>
                    {isEditingUsername ? (
                        <>
                            <input
                                type="text"
                                value={editedUsername}
                                onChange={e => setEditedUsername(e.target.value)}
                                className="text-[11pt] text-center bg-transparent px-0 py-0 outline-none focus:border-b focus:border-blue-400"
                                style={{ minWidth: '100px', border: 'none', borderBottom: '1.5px solid #e5e7eb', borderRadius: 0, margin: 0, height: '24px' }}
                            />
                            <div className="flex items-center gap-2 mt-2 mb-2">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-[10pt]"
                                    onClick={handleUsernameUpdate}
                                >확인</button>
                                <button
                                    className="text-gray-500 px-2 py-1 text-[10pt]"
                                    onClick={() => setIsEditingUsername(false)}
                                >취소</button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center">
                            <div className='w-7' />
                            <h2 className="text-[11pt] text-center" style={{ margin: 0 }}>{userData?.username || 'unknown'}</h2>
                            <button
                                className="text-blue-500 hover:text-blue-700 ml-2"
                                title="이름 편집"
                                onClick={() => {
                                    setIsEditingUsername(true);
                                    setEditedUsername(userData?.username || '');
                                }}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                {/* Pencil icon*/}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <span className="text-[9pt] font-normal w-full justify-center flex text-gray-500 mb-4">
                    {userData?.email || 'Empty email'}
                </span>

                {/* Usage */}
                <Usage />
                
                {/* Buttons */}
                <div className='px-0 py-1 md:px-3 flex flex-col gap-1 md:gap-2'>
                    <MyButton value='로그아웃' type='gradient' onClick={() => handleLogout()} />
                    <MyButton value='비밀번호 재설정' type='flat' onClick={() => ResetPassword()} />
                    <MyButton value='회원탈퇴' type='flat' onClick={() => handleWithdraw()} />
                    <MyButton value='닫기' type='text' onClick={() => setIsOpenProfileModal(false)} />
                </div>
            </div>
        </div>
    );
}