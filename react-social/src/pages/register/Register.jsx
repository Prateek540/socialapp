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
  const description = useRef();
  const city = useRef();
  const from = useRef();
  const relationship = useRef();
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const [error, setError] = useState({
    profileError: "",
    coverError: "",
    usernameError: "",
    emailError: "",
    passwordError: "",
    descriptionError: "",
    cityError: "",
    fromError: "",
    relationshipError: "",
  });

  const [server, setServer] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();

    const data = {
      file1: profile.current.files[0],
      file2: cover.current.files[0],
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
      description: description.current.value,
      city: city.current.value,
      from: from.current.value,
      relationship: relationship.current.value,
    };

    const newError = {
      profileError: "",
      coverError: "",
      usernameError: "",
      emailError: "",
      passwordError: "",
      descriptionError: "",
      cityError: "",
      fromError: "",
      relationshipError: "",
    };

    const isValidFile = (file) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxFileSize = 1024 * 1024 * 5; // 5MB

      return allowedTypes.includes(file.type) && file.size <= maxFileSize;
    };

    setError(newError);

    if (!data.file1) {
      newError.profileError = "Please upload profile picture";
    } else if (!isValidFile(data.file1)) {
      newError.profileError =
        "Only .jpg, .jpeg and .png format allowed with file size less than 5 mb";
    }

    if (!data.file2) {
      newError.coverError = "Please upload cover picture";
    } else if (!isValidFile(data.file2)) {
      newError.coverError =
        "Only .jpg, .jpeg and .png format allowed with file size less than 5 mb";
    }

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

    if (data.description === "") {
      newError.descriptionError = "Description is empty";
    } else if (data.description.length < 10 || data.description.length > 50) {
      newError.descriptionError =
        "Description should be in 10 to 50 characters";
    }

    if (data.city === "") {
      newError.cityError = "City is empty";
    }

    if (data.from === "") {
      newError.fromError = "From is empty";
    }

    if (data.relationship === "") {
      newError.relationshipError = "Relationship is empty";
    }

    if (
      newError.emailError !== "" ||
      newError.passwordError !== "" ||
      newError.usernameError !== "" ||
      newError.descriptionError !== "" ||
      newError.cityError !== "" ||
      newError.fromError !== "" ||
      newError.relationshipError !== ""
    ) {
      setError(newError);
      return;
    }

    axios
      .post("/api/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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
        console.log(err);
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
      <div className="register">
        <div className="registerWrapper">
          <div className="registerLeft">
            <h3 className="registerLogo">Social App</h3>
            <span className="registerDesc">
              Connect with friends on social app
            </span>
          </div>
          <div className="registerRight">
            <form className="registerBox">
              <input
                ref={profile}
                name="file1"
                type="file"
                style={{ display: "none" }}
                accept=".jpg,.jpeg,.png"
                id="file1"
              />
              <label className="registerImageLabel" htmlFor="file1">
                <PermMediaIcon />
                <span className="registerImageDescription">Profile Image</span>
                {error.usernameError !== "" && (
                  <span className="registerValidationMessage">
                    {error.profileError}
                  </span>
                )}
              </label>

              <input
                ref={cover}
                name="file1"
                type="file"
                style={{ display: "none" }}
                accept=".jpg,.jpeg,.png"
                id="file2"
              />
              <label className="registerImageLabel" htmlFor="file2">
                <PermMediaIcon />
                <span className="registerImageDescription">Cover Image</span>
                {error.usernameError !== "" && (
                  <span className="registerValidationMessage">
                    {error.coverError}
                  </span>
                )}
              </label>
              <input
                ref={username}
                type="text"
                className="registerInput"
                placeholder="Username"
              />
              {error.usernameError !== "" && (
                <span className="registerValidationMessage">
                  {error.usernameError}
                </span>
              )}
              <input
                ref={email}
                type="email"
                className="registerInput"
                placeholder="Email"
              />
              {error.emailError !== "" && (
                <span className="registerValidationMessage">
                  {error.emailError}
                </span>
              )}
              <input
                ref={password}
                type="password"
                className="registerInput"
                placeholder="Password"
              />
              {error.passwordError !== "" && (
                <span className="registerValidationMessage">
                  {error.passwordError}
                </span>
              )}
              <input
                ref={description}
                type="text"
                className="registerInput"
                placeholder="Description"
              />
              {error.descriptionError !== "" && (
                <span className="registerValidationMessage">
                  {error.descriptionError}
                </span>
              )}
              <input
                ref={city}
                type="text"
                className="registerInput"
                placeholder="City"
              />
              {error.cityError !== "" && (
                <span className="registerValidationMessage">
                  {error.cityError}
                </span>
              )}
              <input
                ref={from}
                type="text"
                className="registerInput"
                placeholder="From"
              />
              {error.fromError !== "" && (
                <span className="registerValidationMessage">
                  {error.fromError}
                </span>
              )}
              <input
                ref={relationship}
                type="text"
                className="registerInput"
                placeholder="Relationship"
              />
              {error.relationshipError !== "" && (
                <span className="registerValidationMessage">
                  {error.relationshipError}
                </span>
              )}
              <button
                type="submit"
                onClick={submitHandler}
                className="registerButton"
              >
                Sign up
              </button>
              {server !== "" && (
                <span className="registerValidationMessage">{server}</span>
              )}
              <button
                onClick={(e) => e.preventDefault()}
                className="registerRegisterButton"
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
