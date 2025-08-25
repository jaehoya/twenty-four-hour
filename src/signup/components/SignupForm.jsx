import React, { useState } from "react";
import EmailIcon from "../../assets/signup/email_icon.svg";
import KeyIcon from "../../assets/signup/key_icon.svg";
import NameIcon from "../../assets/signup/nickname_icon.svg";
import { useNavigate } from "react-router-dom";

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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, username, password }),
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
        <div className="flex justify-center">
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="border-b-[2px] border-[#DDE4EE] pb-[15px]">
                <label className="text-[13px] font-semibold">아이디</label>
                <div className={`flex flex-row items-center rounded-[7px] mb-[10px]
                                w-[363px] h-[49px]
                                ring-1 ring-[#C6CED9]
                                focus-within:ring-2 focus-within:ring-[#3888FF]`}>
                    <img src={EmailIcon} className="w-[24px] h-[24px] mr-[10px] ml-[10px]" />
                    <input 
                        type="text" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력해주세요." 
                        className="flex-1 min-w-0 placeholder-[#9698A9] text-[15px] outline-none border-none"
                    />
                </div>
                <label className="text-[13px] font-semibold">닉네임</label>
                <div className={`flex flex-row items-center rounded-[7px] mb-[10px]
                                w-[363px] h-[49px]
                                ring-1 ring-[#C6CED9]
                                focus-within:ring-2 focus-within:ring-[#3888FF]`}>
                    <img src={NameIcon} className="w-[24px] h-[24px] mr-[10px] ml-[10px]" />
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="닉네임을 입력해주세요." 
                        className="flex-1 min-w-0 placeholder-[#9698A9] text-[15px] outline-none border-none"
                    />
                </div>
            </div>
            <div className="border-b-[2px] border-[#DDE4EE] pb-[40px] mt-[15px]">
                <label className="text-[13px] font-semibold">비밀번호</label>
                <div className={`flex flex-row items-center rounded-[7px] mb-[10px]
                                w-[363px] h-[49px]
                                ring-1 ring-[#C6CED9]
                                focus-within:ring-2 focus-within:ring-[#3888FF]`}>
                    <img src={KeyIcon} className="w-[24px] h-[24px] mr-[10px] ml-[10px]" />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력해주세요." 
                        className="flex-1 min-w-0 placeholder-[#9698A9] text-[15px] outline-none border-none"
                        />
                </div>
                <div
                    className={`flex flex-row items-center rounded-[7px] 
                                w-[363px] h-[49px] ring-1
                                ${passwordError ? "ring-2 ring-[#F46464]" : "ring-[#C6CED9] focus-within:ring-2 focus-within:ring-[#3888FF]"}`}
                >
                    <img src={KeyIcon} className="w-[24px] h-[24px] mr-[10px] ml-[10px]" />
                    <input 
                        type="password" 
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        placeholder="비밀번호를 다시 입력해주세요." 
                        className="flex-1 min-w-0 placeholder-[#9698A9] text-[15px] outline-none border-none"
                    />
                </div>
                {formError
                    ? <span className="text-[#F46464] text-[11px] mt-1">{formError}</span>
                    : <span className="text-[11px] mt-1 invisible">placeholder</span>
                }
            </div>
            
            <button
                type="submit"
                className={`w-[363px] h-[55px] rounded-[7px] text-[16px] text-white mt-[40px] mb-[20px] font-semibold
                            bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF]`}
            >
            가입하기
            </button>
            <button
                type="button" 
                onClick={() => navigate("/login")}
                className="text-[#368DFF] text-[13px] p-0 text-left"
            >
            로그인으로 돌아가기
            </button>
        </form>
        </div>
    )
}

export default SignupForm;