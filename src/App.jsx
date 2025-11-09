import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from './signup/pages/SignupPage';
import LoginPage from "./login/pages/LoginPage";
import Upload from './upload/pages/Upload';
import StoragePage from './upload/pages/StoragePage';
import FavoritesPage from './upload/pages/FavoritesPage';
import TrashPage from './upload/pages/TrashPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/upload' element={<Upload />}>
          <Route index element={<StoragePage />} />
          <Route path='favorites' element={<FavoritesPage />} />
          <Route path='trash' element={<TrashPage />} />
        </Route>
        <Route path='/' element={<Navigate to="/upload" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
