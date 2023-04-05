import logo from './logo.svg';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import Home from './pages/Home.js';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
