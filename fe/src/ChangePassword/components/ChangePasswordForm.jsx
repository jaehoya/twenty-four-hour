//프로필과 연결되는 비밀번호 변경 폼
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KeyIcon from "../../assets/signup/key_icon.svg";
import InputField from "../../login/components/InputField";
import api from "../../utils/api";

function ChangePasswordForm() {
    const navigate = useNavigate();
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setFormError("");
        setSuccess(false);

        // 비밀번호 유효성 검사
        if (!currentPassword) {
            setFormError("현재 비밀번호를 입력해주세요.");
            return;
        }

        if (!newPassword) {
            setFormError("새 비밀번호를 입력해주세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setFormError("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (newPassword.length < 8) {
            setFormError("비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        if (currentPassword === newPassword) {
            setFormError("새 비밀번호는 현재 비밀번호와 다르게 설정해주세요.");
            return;
        }

        setLoading(true);

        // 인증 토큰 확인 (프로필 비밀번호 변경은 로그인 필요)
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            setFormError("로그인이 필요합니다.");
            setLoading(false);
            navigate("/login");
            return;
        }

        try {
            // 프로필 비밀번호 변경 API 호출 (Authorization 헤더 필요)
            const res = await api.post('/users/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(res.data);
            setSuccess(true);
            alert("비밀번호가 성공적으로 변경되었습니다.");
            navigate("/upload");
        } catch (err) {
            // 에러 처리: 네트워크 타임아웃, HTTP 상태 코드별 처리
            if (err.name === "AbortError") {
                setFormError("요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.");
            } else if (err.response) {
                if (err.response.status === 404) {
                    setFormError("사용자를 찾을 수 없습니다.");
                } else if (err.response.status === 400) {
                    const code = err.response.data?.code;
                    // 현재 비밀번호 불일치 에러 처리
                    if (code === "INVALID_CURRENT_PASSWORD") {
                        setFormError("현재 비밀번호가 일치하지 않습니다.");
                    } else {
                        const msg = err.response.data?.message || "입력값을 확인해주세요.";
                        setFormError(msg);
                    }
                } else if (err.response.status === 422) {
                    const msg = err.response.data?.message || "입력값을 확인해주세요.";
                    setFormError(msg);
                } else if (err.response.status === 401) {
                    // 인증 만료 시 토큰 제거 후 로그인 페이지로 이동
                    setFormError("인증이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem("accessToken");
                    navigate("/login");
                } else {
                    const msg = err.response.data?.message || `요청 실패 (HTTP ${err.response.status})`;
                    setFormError(msg);
                }
            } else {
                setFormError("서버 또는 네트워크 오류가 발생했습니다.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col mx-auto relative" onSubmit={handleSubmit} id="changePasswordForm">
            <div>
                <label htmlFor="currentPassword" className="hidden md:block text-[0.9375rem] font-medium text-[#2A2D41]">현재 비밀번호</label>
                <InputField
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="현재 비밀번호를 입력해주세요."
                    icon={KeyIcon}
                    inputProps={{ autoComplete: "current-password" }}
                    error={!!formError}
                />
                
                <label htmlFor="newPassword" className="hidden md:block text-[0.9375rem] font-medium text-[#2A2D41] mt-3">새 비밀번호</label>
                <InputField
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력해주세요."
                    icon={KeyIcon}
                    inputProps={{ autoComplete: "new-password" }}
                    error={!!formError}
                />
                
                <label htmlFor="confirmPassword" className="hidden md:block text-[0.9375rem] font-medium text-[#2A2D41] mt-3">비밀번호 확인</label>
                <InputField
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호를 다시 입력해주세요."
                    icon={KeyIcon}
                    inputProps={{ autoComplete: "new-password" }}
                    error={!!formError}
                />
                
                {formError && (
                    <p className="text-[#F46464] text-[0.8125rem] mt-1 mb-2">{formError}</p>
                )}
                
                {success && (
                    <p className="text-[#33AAFF] text-[0.8125rem] mt-1 mb-2">
                        비밀번호가 성공적으로 변경되었습니다.
                    </p>
                )}
                
                <div className="md:h-[20px]" />
            </div>
        </form>
    );
}

export default ChangePasswordForm;

