import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './signup/pages/SignupPage';
import Upload from './upload/pages/Upload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/upload' element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;
