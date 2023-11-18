import { useEffect, useState, useContext } from "react";
import "./comment.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function Comments({ id, text }) {
  const { jwtToken } = useContext(AuthContext);
  const [commentUser, setCommentUser] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/users/getuser/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setCommentUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [jwtToken, id]);
  return (
    <>
      <div className="comment own">
        <div className="commentTop">
          <Link to={`/profile/${commentUser.username}`}>
            <img
              src={`/${commentUser.profilePicture}`}
              alt=""
              className="commentImg"
            />
          </Link>

          <p className="commentText">{text}</p>
        </div>
        <div className="commentBottom">{commentUser.username}</div>
      </div>
    </>
  );
}

export default Comments;
