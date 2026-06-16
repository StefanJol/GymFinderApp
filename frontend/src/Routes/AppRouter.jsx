import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainHub from "../pages/MainHub"; 
import Gyms from "../pages/Gyms";

export default function App() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Automatically route root first to login if not authenticated, otherwise straight to Hub */}
        <Route path="/" element={user ? <Navigate to="/hub" replace /> : <Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Updated the path to /hub and the rendered element to <MainHub /> */}
        <Route path="/hub" element={user ? <MainHub /> : <Navigate to="/login" replace />} />
        <Route path="/gyms" element={user ? <Gyms /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}