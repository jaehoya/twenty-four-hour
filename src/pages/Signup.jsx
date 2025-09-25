// src/pages/signup.jsx
// GPT로 구현한 임시 회원가입 페이지
// 추후 대체할 예정

import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">회원가입 (임시 페이지)</h1>
        <p className="mb-4">아직 구현 중인 페이지입니다. 나중에 대체됩니다.</p>
        <Link to="/login" className="text-indigo-600 hover:underline">로그인으로 돌아가기</Link>
      </div>
    </div>
  );
}
