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
import ImgsViewer from "react-images-viewer";

export default function Profile() {
  const params = useParams();
  const { jwtToken } = useContext(AuthContext);
  const [user, setUser] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/users/${params.username}`, {
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
              <ImgsViewer
                imgs={[
                  {
                    src: `/${user.coverPicture}`,
                  },
                  {
                    src: `/${user.profilePicture}`,
                  },
                ]}
                currImg={currImg}
                showThumbnails={true}
                isOpen={isOpen}
                onClickPrev={() => setCurrImg(currImg - 1)}
                onClickNext={() => setCurrImg(currImg + 1)}
                onClickThumbnail={(index) => setCurrImg(index)}
                onClose={(e) => setIsOpen(false)}
              />
              <img
                src={`/${user.coverPicture}`}
                className="profileCoverImg"
                alt="coverPic"
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => {
                  setIsOpen(true);
                  setCurrImg(0);
                }}
              />
              <img
                src={`/${user.profilePicture}`}
                className="profileUserImg"
                alt="ProfilePic"
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => {
                  setIsOpen(true);
                  setCurrImg(1);
                }}
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
