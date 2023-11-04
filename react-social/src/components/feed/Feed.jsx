import { useEffect, useState, useContext } from "react";
import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { jwtToken } = useContext(AuthContext);
  useEffect(() => {
    if (username) {
      axios
        .get(`/api/posts/profile/${username}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get("/api/posts/timeline", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [username, jwtToken]);

  return (
    <>
      <div className="feed">
        <div className="feedWrapper">
          <Share username={username} />
          {posts.map((post) => {
            return <Post key={post._id} post={post} />;
          })}
        </div>
      </div>
    </>
  );
}
