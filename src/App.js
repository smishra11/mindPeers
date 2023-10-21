import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Details from "./Pages/Details";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/comments" element={<Details />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
