import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import GermanyAppPage from "./pages/germany-app";
import SwedenAppPage from "./pages/sweden-app";
import ResultPage from "./pages/result";
import { Toaster } from 'react-hot-toast';
import "./style.css"
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/germany-app" element={<GermanyAppPage />} />
          <Route path="/sweden-app" element={<SwedenAppPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
};

export default App;
