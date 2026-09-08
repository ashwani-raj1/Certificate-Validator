import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Verify from "./components/verify/Verify";
import Admin from "./components/admin/Admin";
import Signin from "./components/signin/Signin";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

export default AppRoutes;
