import { useContext, useEffect, useState } from "react";
import "./closefriend.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Closefriend() {
  const [friendList, setFriendList] = useState([]);
  const { jwtToken } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("/api/users/alluser", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setFriendList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [jwtToken]);
  return (
    <>
      {friendList.map((friend) => {
        const link = `/profile/${friend.username}`;
        return (
          <li key={friend._id} className="sidebarFriend">
            <Link to={link} style={{ textDecoration: "none" }}>
              <img
                className="sidebarFriendImg"
                src={`/${friend.profilePicture}`}
                alt=""
              />
            </Link>
            <span className="sidebarFriendName">{friend.username}</span>
          </li>
        );
      })}
    </>
  );
}
