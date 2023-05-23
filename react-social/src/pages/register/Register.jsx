import { useContext, useRef } from "react";
import "./register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LoginSuccess, LoginFailure } from "../../context/AuthActions";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const username = useRef("PRATEEK");
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    axios
      .post("http://localhost:8000/api/auth/register", data)
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
                ref={username}
                type="text"
                className="loginInput"
                placeholder="Username"
              />
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
              <input
                ref={passwordAgain}
                type="password"
                className="loginInput"
                placeholder="Password Again"
              />
              <button
                type="submit"
                onClick={submitHandler}
                className="loginButton"
              >
                Sign up
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                className="loginRegisterButton"
              >
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log into Account
                </Link>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
