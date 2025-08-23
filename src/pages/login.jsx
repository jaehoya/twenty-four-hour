// 로그인 페이지
// - InputField: 아이디, 비밀번호 입력칸
// - Button: 로그인 버튼

import { useState } from "react";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", email, password);
  };

  return (
    <div className="login-page">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <InputField
          id="email"
          label="아이디"
          type="text"
          placeholder="아이디를 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          id="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="login-btn">
          로그인
        </Button>
      </form>
    </div>
  );
}
