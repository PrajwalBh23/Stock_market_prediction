import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import PredictPage from './components/Predict_section';
import Result from './components/Result';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Home />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/result" element={<Result />} />
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </>
  );
}

export default App;
