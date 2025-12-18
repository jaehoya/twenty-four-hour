import React, { useState, useRef, useEffect } from "react";
import Bg from "../../../assets/upload/background_gradient.svg";
import api from "../../../utils/api";

function Profile({ editable = false, onImageUpdate = null }) {
    const [isHovered, setIsHovered] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // 프로필 이미지 가져오기
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile/me');
                if (response.data?.UserProfile?.ProfileImage?.path) {
                    // API endpoint 기본 URL 설정
                    const baseURL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/api';
                    const imagePath = response.data.UserProfile.ProfileImage.path;
                    // path가 이미 전체 URL이 아니라면 baseURL과 결합
                    const imageUrl = imagePath.startsWith('http') 
                        ? imagePath 
                        : `${baseURL.replace('/api', '')}/${imagePath}`;
                    setProfileImage(imageUrl);
                }
            } catch (error) {
                console.error('프로필 이미지 로드 실패:', error);
            }
        };

        fetchProfile();

        // 프로필 업데이트 이벤트 리스닝
        const handleProfileUpdate = () => fetchProfile();
        window.addEventListener('profileUpdated', handleProfileUpdate);

        return () => {
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, []);

    const handleEditClick = () => {
        if (editable) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 이미지 파일인지 확인
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        setIsUploading(true);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('로그인이 필요합니다.');
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await api.put('/profile/me', formData, { headers: { 'Authorization': `Bearer ${token}` } });

            if (response.status === 200 && response.data?.UserProfile?.ProfileImage?.path) {
                const baseURL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/api';
                const imagePath = response.data.UserProfile.ProfileImage.path;
                const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseURL.replace('/api', '')}/${imagePath}`;
                setProfileImage(imageUrl);
                
                // 부모 컴포넌트에 업데이트 알림
                if (onImageUpdate) onImageUpdate(imageUrl);
                
                alert('프로필 사진이 변경되었습니다.');
            }
        } catch (error) {
            console.error('프로필 사진 업로드 실패:', error);
            if (error.response?.data?.message) alert(`업로드 실패: ${error.response.data.message}`);
            else alert('프로필 사진 업로드에 실패했습니다.');
        } finally { setIsUploading(false); }
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div
                className="rounded-full w-full md:w-[80%] aspect-1 overflow-hidden relative group"
                onMouseEnter={() => editable && setIsHovered(true)}
                onMouseLeave={() => editable && setIsHovered(false)}
            >
                <img
                    src={profileImage || Bg}
                    alt="profile" 
                    className="w-full h-full object-cover" 
                />
                
                {/* 편집 가능할 때만 hover 오버레이 표시 */}
                {editable && (
                    <>
                        <div
                            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-opacity duration-200 ${ isHovered ? 'opacity-60' : 'opacity-0' }`}
                            onClick={handleEditClick}
                        >
                            {isUploading ?
                                <div className="text-white text-sm font-light">업로드 중...</div>
                                :
                                <div className="text-white text-sm font-light">편집</div>
                            }
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default Profile;