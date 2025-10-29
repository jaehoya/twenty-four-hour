import { useState } from "react";
import EmailIcon from "../../assets/signup/email_icon.svg";
import KeyIcon from "../../assets/signup/key_icon.svg";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            alert("login");
            // TODO: Login Logic
            // const response = await api.post("/users/login", { email, password });
        } catch (err) {
            if (err.name === "AbortError") {
            setFormError("요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.");
        } else {
            setFormError("서버 또는 네트워크 오류가 발생했습니다.");
        }
            console.error(err);
        } finally {
            clearTimeout(timeoutId);
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