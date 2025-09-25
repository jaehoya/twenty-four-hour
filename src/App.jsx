// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-6">404 - 페이지를 찾을 수 없습니다</div>} />
    </Routes>
  );
}