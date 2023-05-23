import { useContext, useEffect, useState } from "react";
import Online from "../online/Online";
import "./rightbar.css";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Rightbar({ profile }) {
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="/assets/gift.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Prateek</b> and <b>3 other friends</b> have birthday today
          </span>
        </div>
        <img src="/assets/ad.png" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          <Online />
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    const [user, setUser] = useState({});
    const [userFriends, setUserFriends] = useState([]);
    const { jwtToken } = useContext(AuthContext);
    useEffect(() => {
      axios
        .get(`http://localhost:8000/api/users/${profile}`, {
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
    }, [jwtToken]);
    useEffect(() => {
      axios
        .get(`http://localhost:8000/api/users/friends/username/${profile}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          setUserFriends(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [user.username, jwtToken]);
    const { currentUser } = useContext(AuthContext);
    const handleClick = () => {
      window.location.reload();
    };
    return (
      <>
        {profile === currentUser.username ? (
          <></>
        ) : (
          <button onClick={handleClick} className="rightbarFollowButton">
            Follow
            <AddIcon />
          </button>
        )}

        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {userFriends.map((friends) => {
            return (
              <div key={friends._id} className="rightbarFollowing">
                <img
                  src={friends.profilePicture}
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">
                  {friends.username}
                </span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="rightbar">
        <div className="rightbarWrapper">
          {profile ? <ProfileRightbar /> : <HomeRightbar />}
        </div>
      </div>
    </>
  );
}
