import { useParams } from "react-router-dom";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import "./profile.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function Profile() {
  const params = useParams();
  const { jwtToken } = useContext(AuthContext);
  const [user, setUser] = useState({});
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/users/${params.username}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [jwtToken, params.username]);
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img src={user.coverPicture} className="profileCoverImg" alt="" />
              <img
                src={user.profilePicture}
                className="profileUserImg"
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.description}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={params.username} />
            <Rightbar profile={params.username} />
          </div>
        </div>
      </div>
    </>
  );
}
