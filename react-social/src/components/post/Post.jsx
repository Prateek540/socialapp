import { useEffect, useState, useContext } from "react";
import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { format } from "timeago.js";

export default function Post(props) {
  const { jwtToken } = useContext(AuthContext);
  const [postUser, setPostUser] = useState({});
  const [likeCount, setLikeCount] = useState(props.post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [show, setShow] = useState(false);

  const showComment = () => {
    setShow(!show);
  };

  useEffect(() => {
    axios
      .get(`/api/users/getuser/${props.post.userId}`, {
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
      .get(`/api/posts/${props.post._id}/likestatus`, {
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
        `/api/posts/${props.post._id}/like`,
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
                  src={`/${postUser.profilePicture}`}
                  alt=""
                  className="postProfileImg"
                />
              </Link>
              <span className="postUsername">{postUser.username}</span>
              <span className="postDate">{format(postUser.updatedAt)}</span>
            </div>
            <div className="postTopRight">
              <MoreVertIcon />
            </div>
          </div>
          <div className="postCenter">
            <span className="postText"> {props.post.description}</span>
            <img src={`/${props.post.image}`} className="postImg" alt="" />
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              {isLiked ? (
                <ThumbUpAltIcon className="bigLikeIcon" onClick={likeHandler} />
              ) : (
                <ThumbUpOffAltIcon
                  className="smallLikeIcon"
                  onClick={likeHandler}
                />
              )}

              <span className="postLikeCounter">
                {isLiked
                  ? `You and ${likeCount - 1} other liked it`
                  : `${likeCount} people liked it`}
              </span>
            </div>
            <div className="postBottomRight">
              <div className="postCommentText" onClick={showComment}>
                Comment
              </div>
            </div>
          </div>
          {show && <div className="postComment">DIKHEGA</div>}
        </div>
      </div>
    </>
  );
}
