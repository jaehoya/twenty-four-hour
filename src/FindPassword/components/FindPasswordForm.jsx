/**
 * FindPasswordForm 컴포넌트
 * 비밀번호 찾기 폼
 */
import { useState } from "react";
import EmailIcon from "../../assets/signup/email_icon.svg";
import InputField from "../../login/components/InputField";
import api from "../../utils/api";

function FindPasswordForm() {
    const [email, setEmail] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setFormError("");
        setSuccess(false);

        if (!email) {
            setFormError("이메일을 입력해주세요.");
            return;
        }

        setLoading(true);

        try {
            // 비밀번호 재설정 요청 API 호출 (이메일만 전송)
            const res = await api.post('/users/reset-password', { email });
            console.log(res.data);
            setSuccess(true);
            alert("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
        } catch (err) {
            // 에러 처리: 사용자 없음(404), 입력값 오류(400/422) 등
            if (err.name === "AbortError") {
                setFormError("요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.");
            } else if (err.response) {
                if (err.response.status === 404) {
                    setFormError("해당 이메일로 등록된 계정을 찾을 수 없습니다.");
                } else if (err.response.status === 400 || err.response.status === 422) {
                    const msg = err.response.data.message || "입력값을 확인해주세요.";
                    setFormError(msg);
                } else {
                    const msg = err.response.data.message || `요청 실패 (HTTP ${err.response.status})`;
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
        <form className="flex flex-col mx-auto relative" onSubmit={handleSubmit} id="findPasswordForm">
            <div>
                <label htmlFor="email" className="hidden md:block text-[0.9375rem] font-medium text-[#2A2D41]">이메일</label>
                <InputField
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력해주세요."
                    icon={EmailIcon}
                    inputProps={{ autoComplete: "email" }}
                    error={!!formError}
                />
                
                {formError && (
                    <p className="text-[#F46464] text-[0.8125rem] mt-1 mb-2">{formError}</p>
                )}
                
                {success && (
                    <p className="text-[#33AAFF] text-[0.8125rem] mt-1 mb-2">
                        비밀번호 재설정 링크가 이메일로 전송되었습니다.
                    </p>
                )}
                
            </div>
        </form>
    );
}

export default FindPasswordForm;

