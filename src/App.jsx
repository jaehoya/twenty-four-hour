import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from './signup/pages/SignupPage';
import LoginPage from "./login/pages/LoginPage";
import FindPasswordPage from "./FindPassword/pages/FindPasswordPage";
import ResetPasswordPage from "./ResetPassword/pages/ResetPasswordPage";
import ChangePasswordPage from "./ChangePassword/pages/ChangePasswordPage";
import Upload from './upload/pages/Upload';
import StoragePage from './upload/pages/StoragePage';
import FavoritesPage from './upload/pages/FavoritesPage';
import TrashPage from './upload/pages/TrashPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/find-password" element={<FindPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path='/change-password' element={<ChangePasswordPage />} />
        <Route path="/upload" element={<Upload />}>
          <Route index element={<StoragePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="trash" element={<TrashPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
