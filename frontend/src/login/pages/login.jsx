// src/pages/login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import logoUrl from "../../assets/signup/24_logo.svg";
import backgroundGradient from "../../assets/signup/background_gradient.svg";
import Button from "../components/button.js";
import InputField from "../components/inputField.jsx";
import keyIcon from "../../assets/signup/key_icon.svg";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", email, password);
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center md:grid md:w-[60svw] md:h-[60svh] md:place-items-center p-4">
      <div className="flex w-full text-[0.9375rem] md:max-w-6xl p-4 rounded-3xl bg-white md:shadow-[0_0_70px_0_rgba(73,91,134,0.2)]">
        <div className="hidden md:block w-full rounded-r-2xl md:w-3/5 h-auto">
          <img
            src={backgroundGradient}
            alt="background_gradient"
            className="w-auto h-full object-cover"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full md:p-8 space-y-8 md:w-2/5 md:grid place-items-center"
        >
          <div>
            <img src={logoUrl} alt="24_logo" className="h-auto max-w-[56px] md:max-w-[82px]" />
          </div>
          <div className="w-full space-y-2 flex flex-col">
            <div className="block md:hidden">
              <h2 className="">로그인</h2>
            </div>
            <InputField
              id="email"
              label="이메일"
              type="text"
              icon={idIcon}
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              id="password"
              label="패스워드"
              type="password"
              icon={keyIcon}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link to="/find-password" className="text-[12px] text-sky-500 mt-0 md:ml-4">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
            <hr className="w-full border-[#DDE4EE]" />
          <div className="w-full flex flex-col place-items-center space-y-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF]"
            >
              로그인
            </Button>
            <Link to="/signup" className="text-sm underline">
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
