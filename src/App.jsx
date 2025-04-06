import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import Home from "./Pages/home/home";
import Profile from "./Pages/Profile/profile";
import Login from "./Pages/Login/login";
import Register from "./Pages/Register/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />             {/* Default route */}
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
