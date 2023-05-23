import { useRef, useContext } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginSuccess, LoginFailure } from "../../context/AuthActions";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Login() {
  const email = useRef();
  const password = useRef();

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      email: email.current.value,
      password: password.current.value,
    };

    axios
      .post("http://localhost:8000/api/auth/login", data)
      .then((response) => {
        dispatch(LoginSuccess(response.data.token, response.data.other));
        localStorage.setItem("jwtToken", response.data.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(response.data.other)
        );
        localStorage.setItem("isAuthenticated", true);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        dispatch(LoginFailure());
      });
  };
  return (
    <>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Social App</h3>
            <span className="loginDesc">
              Connect with friends on social app
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox">
              <input
                ref={email}
                type="email"
                className="loginInput"
                placeholder="Email"
              />
              <input
                ref={password}
                type="password"
                className="loginInput"
                placeholder="Password"
              />
              <button
                onClick={submitHandler}
                type="submit"
                className="loginButton"
              >
                Log in
              </button>
              <span className="loginForgot">Forgot Password</span>
              <button
                className="loginRegisterButton"
                onClick={(e) => e.preventDefault()}
              >
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Create a new Account
                </Link>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
