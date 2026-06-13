import { BrowserRouter, Routes, Route } from "react-router";
import Menu from "../components/Menu";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Gyms from "../pages/Gyms";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        {/* news and about for testing stuff*/}
        <Route path="/gyms" element={<Gyms />} />
        <Route path="/about" element={<main><h1>About Page Placeholder</h1></main>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}