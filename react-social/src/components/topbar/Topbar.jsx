import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { LogoutSuccess } from "../../context/AuthActions";
import axios from "axios";

export default function Topbar() {
  const navigate = useNavigate();
  const { dispatch, jwtToken, currentUser } = useContext(AuthContext);
  const linkProfile = `/profile/${currentUser.username}`;
  const logoutHandler = () => {
    axios
      .post(
        "http://localhost:8000/api/auth/logoutAll",
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch(LogoutSuccess());
    localStorage.clear();
  };
  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">Social App</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <SearchIcon className="searchIcon" />
            <input
              placeholder="Search for friend, post or video"
              className="searchInput"
            />
          </div>
        </div>
        <div className="topbarRight">
          <div className="topbarLinks">
            <Link
              to={linkProfile}
              style={{ textDecoration: "none", color: "white" }}
            >
              <span className="topbarLink">Homepage</span>
            </Link>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <span className="topbarLink">Timeline</span>
            </Link>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <PersonIcon />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <ChatIcon />
              <span className="topbarIconBadge">2</span>
            </div>
            <div className="topbarIconItem">
              <NotificationsIcon />
              <span className="topbarIconBadge">3</span>
            </div>
          </div>
          <img
            onClick={logoutHandler}
            src="/assets/person/1.jpeg"
            alt=""
            className="topbarImg"
          />
        </div>
      </div>
    </>
  );
}
