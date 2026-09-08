import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import AppRoutes from "./AppRoutes";
import Footer from "./components/footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
