import { useEffect, useState, useContext } from "react";
import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Post(props) {
  const { jwtToken } = useContext(AuthContext);
  const [postUser, setPostUser] = useState({});
  const [likeCount, setLikeCount] = useState(props.post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/users/getuser/${props.post.userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setPostUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [jwtToken, props.post.userId]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/posts/${props.post._id}/likestatus`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setIsLiked(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [jwtToken, props.post._id]);

  const likeHandler = () => {
    axios
      .put(
        `http://localhost:8000/api/posts/${props.post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .then((response) => {
        if (isLiked) {
          setLikeCount((count) => count - 1);
        } else {
          setLikeCount((count) => count + 1);
        }
        setIsLiked(!isLiked);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const link = `/profile/${postUser.username}`;

  return (
    <>
      <div className="post">
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              <Link to={link}>
                <img
                  src={postUser.profilePicture}
                  alt=""
                  className="postProfileImg"
                />
              </Link>
              <span className="postUsername">{postUser.username}</span>
              <span className="postDate">5 mins ago</span>
            </div>
            <div className="postTopRight">
              <MoreVertIcon />
            </div>
          </div>
          <div className="postCenter">
            <span className="postText"> {props.post.description}</span>
            <img src={props.post.image} className="postImg" alt="" />
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              {isLiked ? (
                <img
                  className="bigLikeIcon"
                  src="/assets/heart.png"
                  alt=""
                  onClick={likeHandler}
                />
              ) : (
                <></>
              )}
              <img
                className="smallLikeIcon"
                src="/assets/like.png"
                alt=""
                onClick={likeHandler}
              />

              <span className="postLikeCounter">
                {likeCount} people like it
              </span>
            </div>
            <div className="postBottomRight">
              <div className="postCommentText">5 comments</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
