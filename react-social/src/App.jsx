import { useContext } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
          <Route
            path="/profile/:username"
            element={isAuthenticated ? <Profile /> : <Login />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Home />}
          />
          <Route
            path="/messenger"
            element={isAuthenticated ? <Messenger /> : <Login />}
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
