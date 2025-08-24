import React, { useState } from "react";
import IdIcon from "../../assets/signup/id_icon.png";
import KeyIcon from "../../assets/signup/key_icon.png";
import NameIcon from "../../assets/signup/name_icon.png";
import { useNavigate } from "react-router-dom";

function SignupForm() {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordCheck) {
            setPasswordError(true);
            return;
        }

        setPasswordError(false);
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
                    <img src={IdIcon} className="w-[24px] h-[24px] mr-[10px] ml-[10px]" />
                    <input 
                        type="text" 
                        value={id} 
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디를 입력해주세요." 
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
                {passwordError && (
                    <span className="text-[#F46464] text-[11px] mt-1">비밀번호가 일치하지 않습니다.</span>
                )}
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