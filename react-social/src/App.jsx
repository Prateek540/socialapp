import { useContext } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Home />}
          />
          <Route
            path="/profile/:username"
            element={isAuthenticated ? <Profile /> : <Login />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Home />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;

//2:40:00
