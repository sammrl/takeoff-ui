import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectPage from './ProjectPage';
import CoinDetailPage from './components/CoinDetailPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectPage />} />
        <Route path="/coin/:symbol" element={<CoinDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
