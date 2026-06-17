import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Type from "./pages/Type";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";
import HindiGuide from "./pages/HindiGuide";
import Prediction from "./pages/Prediction";
import Profile from "./pages/Profile"; 
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-bg">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/type" element={<Type />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/hindi-guide" element={<HindiGuide />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
          <Footer />
      </div>
    </Router>
  );
}