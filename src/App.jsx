import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './signup/pages/SignupPage';
import SignupForm from "./signup/components/SignupForm";
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
