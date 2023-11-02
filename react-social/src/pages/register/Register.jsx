import { useContext, useRef, useState } from "react";
import "./register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LoginSuccess, LoginFailure } from "../../context/AuthActions";
import { AuthContext } from "../../context/AuthContext";
import PermMediaIcon from "@mui/icons-material/PermMedia";

export default function Register() {
  const profile = useRef();
  const cover = useRef();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const [error, setError] = useState({
    profileError: "",
    coverError: "",
    usernameError: "",
    emailError: "",
    passwordError: "",
  });

  const [server, setServer] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(profile.current.files[0]);
    console.log(cover.current.files[0]);
    const data = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    const newError = {
      profileError: "",
      coverError: "",
      usernameError: "",
      emailError: "",
      passwordError: "",
    };

    setError(newError);

    if (data.username === "") {
      newError.usernameError = "Username is empty";
    } else if (data.username.length > 20 || data.username.length < 6) {
      newError.usernameError = "Username must be between 6 to 20 characters";
    }

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

    if (
      newError.emailError !== "" ||
      newError.passwordError !== "" ||
      newError.usernameError !== ""
    ) {
      setError(newError);
      return;
    }

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
      .catch((err) => {
        if (err.response?.data) {
          if (typeof err.response.data === "string")
            setServer(err.response.data);
          else setServer("Username or email already in use.");
        } else {
          setServer("Server is offline please try again !!!");
        }
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
                ref={profile}
                type="file"
                style={{ display: "none" }}
                accept=".jpg,.jpeg,.png"
                id="file1"
              />
              <label className="imageLabel" htmlFor="file1">
                <PermMediaIcon />
                <span className="imageDescription">Profile Image</span>
              </label>
              <input
                ref={cover}
                type="file"
                style={{ display: "none" }}
                accept=".jpg,.jpeg,.png"
                id="file2"
              />
              <label className="imageLabel" htmlFor="file2">
                <PermMediaIcon />
                <span className="imageDescription">Cover Image</span>
              </label>
              <input
                ref={username}
                type="text"
                className="loginInput"
                placeholder="Username"
              />
              {error.usernameError !== "" && (
                <span className="ValidationMessage">{error.usernameError}</span>
              )}
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
                type="submit"
                onClick={submitHandler}
                className="loginButton"
              >
                Sign up
              </button>
              {server !== "" && (
                <span className="ValidationMessage">{server}</span>
              )}
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
