import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Upload from './upload/pages/Upload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/upload' element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;

