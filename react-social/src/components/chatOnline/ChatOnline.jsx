import { useEffect, useState, useContext } from "react";
import "./chatOnline.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const { jwtToken } = useContext(AuthContext);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(
        `http://localhost:8000/api/users/friends/${currentId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setFriends(res.data);
    };
    getFriends();
  }, [currentId, jwtToken]);

  useEffect(() => {
    setOnlineFriends(
      friends.filter((friend) => onlineUsers.includes(friend._id))
    );
  }, [onlineUsers, friends]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/conversations/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="chatOnline">
        {onlineFriends.map((online) => (
          <div
            key={online._id}
            className="chatOnlineFriend"
            onClick={() => handleClick(online)}
          >
            <div className="chatOnlineImgContainer">
              <img
                src={online.profilePicture}
                className="chatOnlineImg"
                alt=""
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{online.username}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatOnline;
