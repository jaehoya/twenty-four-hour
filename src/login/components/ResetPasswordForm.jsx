/**
 * ResetPasswordForm 컴포넌트
 * 비밀번호 재설정 
 */
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import KeyIcon from "../../assets/signup/key_icon.svg";
import InputField from "./InputField";
import api from "../../utils/api";

function ResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // 이메일 링크에서 전달된 토큰과 이메일 추출
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setFormError("");

        // URL 파라미터 검증 (이메일 링크에서 접근한 경우 필수)
        if (!token || !email) {
            setFormError("유효하지 않은 링크입니다. 이메일을 다시 확인해주세요.");
            return;
        }

        // 비밀번호 유효성 검사
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

        setLoading(true);

        try {
            // 비밀번호 재설정 API 호출 (이메일, 토큰, 새 비밀번호 전송)
            const res = await api.post('/users/reset-password', {
                email,
                token,
                newPassword
            });
            console.log(res.data);
            alert("비밀번호가 성공적으로 재설정되었습니다.");
            navigate("/login");
        } catch (err) {
            // 에러 처리: 토큰 만료/무효(400), 사용자 없음(404) 등
            if (err.name === "AbortError") {
                setFormError("요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.");
            } else if (err.response) {
                if (err.response.status === 404) {
                    setFormError("사용자를 찾을 수 없습니다.");
                } else if (err.response.status === 400) {
                    const code = err.response.data?.code;
                    // 토큰 만료 또는 무효 에러 처리
                    if (code === "INVALID_OR_EXPIRED_TOKEN") {
                        setFormError("토큰이 유효하지 않거나 만료되었습니다.");
                    } else {
                        const msg = err.response.data?.message || "입력값을 확인해주세요.";
                        setFormError(msg);
                    }
                } else if (err.response.status === 422) {
                    const msg = err.response.data?.message || "입력값을 확인해주세요.";
                    setFormError(msg);
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

    // 토큰 또는 이메일이 없으면 에러 메시지만 표시
    if (!token || !email) {
        return (
            <div className="flex flex-col mx-auto relative">
                <p className="text-[#F46464] text-[0.8125rem] mt-1 mb-2">
                    유효하지 않은 링크입니다. 이메일을 다시 확인해주세요.
                </p>
            </div>
        );
    }

    return (
        <form className="flex flex-col mx-auto relative" onSubmit={handleSubmit} id="resetPasswordForm">
            <div>
                <label htmlFor="newPassword" className="hidden md:block text-[0.9375rem] font-medium text-[#2A2D41]">새 비밀번호</label>
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
                
                <div className="md:h-[40px]" />
            </div>
        </form>
    );
}

export default ResetPasswordForm;

