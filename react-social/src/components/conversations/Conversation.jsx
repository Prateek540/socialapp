import { useContext, useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Conversation({ conversation, currentUser, setFriendUser }) {
  const [user, setUser] = useState({});
  const { jwtToken } = useContext(AuthContext);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios(
          `http://localhost:8000/api/users/getuser/${friendId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setUser(res.data);
        setFriendUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation, jwtToken, setFriendUser]);
  return (
    <>
      <div className="conversation">
        <img src={user.profilePicture} alt="" className="conversationImg" />
        <span className="conversationName">{user.username}</span>
      </div>
    </>
  );
}

export default Conversation;
