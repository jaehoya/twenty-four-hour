import React, { useState } from "react";
import EmailIcon from "../../assets/signup/email_icon.svg";
import KeyIcon from "../../assets/signup/key_icon.svg";
import NameIcon from "../../assets/signup/nickname_icon.svg";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import api from '../../utils/api';

function SignupForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const [passwordError, setPasswordError] = useState(false);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setFormError("");

        if (password !== passwordCheck) {
            setPasswordError(true);
            setFormError("비밀번호가 일치하지 않습니다.")
            return;
        }

        setPasswordError(false);
        setLoading(true);

        try {
            api.post('/users/signup', { email, username, password })
                .then((res) => {
                    alert("회원가입 성공!");
                    navigate("/login");
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status === 409) {
                            setFormError("이미 사용 중인 이메일입니다.");
                        } else if (err.response.status === 400 || err.response.status === 422) {
                            const msg = err.response.data.message || "입력값을 확인해주세요.";
                            setFormError(msg);
                        } else {
                            const msg = err.response.data.message || `회원가입 실패 (HTTP ${err.response.status})`;
                            setFormError(msg);
                        }
                    } else {
                        setFormError("서버 또는 네트워크 오류가 발생했습니다.");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (err) {
            if (err.name === "AbortError") {
                setFormError("요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.");
            } else {
                setFormError("서버 또는 네트워크 오류가 발생했습니다.");
            }
            console.error(err);
        }
    }

    return (
        <form className="flex flex-col mx-auto relative" onSubmit={handleSubmit} id="signupForm">
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
                />
                
                <label htmlFor="username" className="hidden md:block text-[0.9375rem] font-medium text-[#2A2D41] mt-2 md:mt-[2%]">닉네임</label>
                <InputField
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="닉네임을 입력해주세요."
                    icon={NameIcon}
                    inputProps={{ autoComplete: "username" }}
                />
                
                <div className="h-px w-full max-w-[363px] bg-[#DDE4EE] my-8 md:my-3 md:my-5" />
                
                <label htmlFor="password" className="hidden md:block text-[0.9375rem] font-medium text-[#2A2D41]">비밀번호</label>
                <InputField
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요."
                    icon={KeyIcon}
                    inputProps={{ autoComplete: "new-password" }}
                />
                
                <InputField
                    id="passwordCheck"
                    type="password"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요."
                    icon={KeyIcon}
                    error={passwordError}
                    inputProps={{ autoComplete: "new-password" }}
                />
                <div className="min-h-[11px]">
                    {formError
                        && <span className="text-[#F46464] text-[11px] mt-1">{formError}</span>
                    }
                </div>
                <div className="h-px w-full max-w-[363px] bg-[#DDE4EE] my-3 md:hidden" />
            </div>
            <div className="h-4 md:h-12" />
        </form>
    )
}

export default SignupForm;