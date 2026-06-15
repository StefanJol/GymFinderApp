import { BrowserRouter, Routes, Route } from "react-router";
import Menu from "../components/Menu";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Gyms from "../pages/Gyms";
import Partners from "../pages/Partners";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/gyms" element={<Gyms />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}