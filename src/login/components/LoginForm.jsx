import { useState } from "react";
import EmailIcon from "../../assets/signup/email_icon.svg";
import KeyIcon from "../../assets/signup/key_icon.svg";
import NameIcon from "../../assets/signup/nickname_icon.svg";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";

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

        if (password !== passwordCheck) {
            setPasswordError(true);
            setFormError("비밀번호가 일치하지 않습니다.")
            return;
        }

        setPasswordError(false);
        setLoading(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
                signal: controller.signal,
            });

            const ct = response.headers.get("content-type") || "";
            let body = null;
            try {
                body = ct.includes("application/json") ? await response.json() : await response.text();
            } catch (_) {
                body = null;
            }

            if (!response.ok) {
                if (response.status === 409) {
                    setFormError("이미 사용 중인 아이디입니다.");
                } else if (response.status === 400 || response.status === 422) {
                    const msg = (body && (body.message || body.error)) || "입력값을 확인해주세요.";
                    setFormError(msg);
                } else {
                    const msg = (body && (body.message || body.error)) || `회원가입 실패 (HTTP ${response.status})`;
                    setFormError(msg);
                }
                return;
            }

            alert("회원가입 성공!");
            navigate("/login");
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
            </div>
        </form>
    )
}

export default LoginForm;