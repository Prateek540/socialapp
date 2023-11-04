import { useContext, useEffect, useState } from "react";
import Online from "../online/Online";
import "./rightbar.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Rightbar({ profile }) {
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="public/assets/gift.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Prateek</b> and <b>3 other friends</b> have birthday today
          </span>
        </div>
        <img src="public/assets/ad.png" alt="" className="rightbarAd" />
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
    const { currentUser } = useContext(AuthContext);
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
      axios
        .get(`/api/users/${profile}`, {
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
        .get(`/api/users/friends/username/${profile}`, {
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
    }, [jwtToken]);

    useEffect(() => {
      if (profile !== currentUser.username && user._id) {
        axios
          .get(`/api/users/isFollowed/${user._id}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((response) => {
            setIsFollowed(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, [user._id, jwtToken, currentUser.username]);

    const handleClick = () => {
      if (isFollowed) {
        //unfollow
        axios
          .put(
            `/api/users/${user._id}/unfollow`,
            {},
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          )
          .then(() => {
            setIsFollowed(!isFollowed);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (!isFollowed) {
        //follow
        axios
          .put(
            `/api/users/${user._id}/follow`,
            {},
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          )
          .then(() => {
            setIsFollowed(!isFollowed);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    return (
      <>
        {profile !== currentUser.username &&
          (isFollowed ? (
            <button onClick={handleClick} className="rightbarFollowButton">
              Unfollow
              <RemoveIcon />
            </button>
          ) : (
            <button onClick={handleClick} className="rightbarFollowButton">
              Follow
              <AddIcon />
            </button>
          ))}

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
                  src={`/${friends.profilePicture}`}
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
