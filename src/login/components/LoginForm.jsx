// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import EmailIcon from "../../assets/signup/email_icon.svg";
import KeyIcon from "../../assets/signup/key_icon.svg";

// Components
import InputField from "./InputField";

// Utils
import api from "../../utils/api";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [formError, setFormError] = useState("formError");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setFormError("");

        setLoading(true);

        try {
            const res = await api.post('/users/login', { email, password })
            console.log(res.data);
            const { accessToken } = res.data;

            localStorage.setItem("accessToken", accessToken);
            alert("로그인 성공!");
            navigate("/upload");
        } catch (err) {
            if (err.name === "AbortError") {
            setFormError("요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.");
            if (err.response) {
                if (err.response.status === 401) {
                    setFormError("이메일 또는 비밀번호가 올바르지 않습니다.");
                } else if (err.response.status === 400 || err.response.status === 422) {
                    const msg = err.response.data.message || "입력값을 확인해주세요.";
                    setFormError(msg);
                } else {
                    const msg = err.response.data.message || `로그인 실패 (HTTP ${err.response.status})`;
                    setFormError(msg);
                }
            } else {
                setFormError("서버 또는 네트워크 오류가 발생했습니다.");
            }
        } else {
            setFormError("서버 또는 네트워크 오류가 발생했습니다.");
        }
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="flex flex-col mx-auto relative" onSubmit={handleSubmit} id="loginForm">
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

                <span onClick={() => { alert("비밀번호 찾기 페이지로 이동"); }} className="hidden md:block cursor-pointer absolute right-0 text-[9pt] text-[#33AAFF]">
                    비밀번호를 잊으셨나요?
                </span>
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
                <span onClick={() => { alert("비밀번호 찾기 페이지로 이동"); }} className="md:hidden text-[10pt] text-[#33AAFF] cursor-pointer self-end mb-3">
                    비밀번호를 잊으셨나요?
                </span>
                <div className="md:h-[40px]" />
            </div>
        </form>
    )
}

export default LoginForm;