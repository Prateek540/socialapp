import { useRef, useContext, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginSuccess, LoginFailure } from "../../context/AuthActions";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
  });

  const [server, setServer] = useState("");

  const { dispatch } = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      email: email.current.value,
      password: password.current.value,
    };

    const newError = {
      emailError: "",
      passwordError: "",
    };

    setError(newError);

    if (data.email === "") {
      newError.emailError = "Email is empty";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      newError.emailError = "Email is incorrect";
    }

    if (data.password === "") {
      newError.passwordError = "Password is empty";
    } else if (data.password.length < 6 || data.password.length > 20) {
      newError.passwordError = "Password limit is 6 to 20 characters";
    }

    if (newError.emailError !== "" || newError.passwordError !== "") {
      setError(newError);
      return;
    }

    axios
      .post("/api/auth/login", data)
      .then((response) => {
        console.log(response);
        dispatch(LoginSuccess(response.data.token, response.data.other));
        localStorage.setItem("jwtToken", response.data.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(response.data.other)
        );
        localStorage.setItem("isAuthenticated", true);
        navigate("/");
      })
      .catch((err) => {
        if (err.response?.data) setServer(err.response.data);
        else setServer("Server is offline please try again !!!");
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
              {error.emailError !== "" && (
                <span className="ValidationMessage">{error.emailError}</span>
              )}
              <input
                ref={password}
                type="password"
                className="loginInput"
                placeholder="Password"
              />
              {error.passwordError !== "" && (
                <span className="ValidationMessage">{error.passwordError}</span>
              )}
              <button
                onClick={submitHandler}
                type="submit"
                className="loginButton"
              >
                Log in
              </button>
              {server !== "" && (
                <span className="ValidationMessage">{server}</span>
              )}
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
