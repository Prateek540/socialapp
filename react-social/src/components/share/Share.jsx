import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useContext, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Share({ username }) {
  const { currentUser } = useContext(AuthContext);
  const text = `What's in your mind ${currentUser.username}`;
  const { jwtToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const submitHandler = (event) => {
    event.preventDefault();
    if (image === null) {
      alert("Need Image to create a post");
      return;
    }
    if (description === "") {
      alert("Description cannot be empty");
      return;
    }
    const data = {
      userId: currentUser._id,
      description,
      image,
    };
    axios
      .post("/api/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then(() => {
        setDescription("");
        setImage(null);
        window.location.reload();
      })
      .catch(() => {
        setDescription("");
        setImage(null);
        alert("Problem in creating post try again.");
      });
  };

  return (
    <>
      {username === currentUser.username || !username ? (
        <div className="share">
          <div className="shareWrapper">
            <form className="shareBottom" onSubmit={submitHandler}>
              <div className="shareTop">
                <img
                  src={`/${currentUser.profilePicture}`}
                  className="shareProfileImg"
                  alt=""
                />
                <input
                  type="text"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="shareInput"
                  placeholder={text}
                />
              </div>
              <hr className="shareHr" />
              {image && (
                <div className="shareImgContainer">
                  <img
                    className="shareImg"
                    src={URL.createObjectURL(image)}
                    alt=""
                  />
                  <CancelIcon
                    className="shareCancelImg"
                    onClick={() => setImage(null)}
                  />
                </div>
              )}

              <div className="shareOptions">
                <label htmlFor="image" className="shareOption">
                  <PermMediaIcon htmlColor="red" className="shareIcon" />
                  <span className="shareOptionText">Photo or Video</span>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="image"
                    name="image"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
                <div className="shareOption">
                  <LabelIcon htmlColor="blue" className="shareIcon" />
                  <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                  <RoomIcon htmlColor="green" className="shareIcon" />
                  <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption">
                  <EmojiEmotionsIcon
                    htmlColor="goldenrod"
                    className="shareIcon"
                  />
                  <span className="shareOptionText">Likes</span>
                </div>
                <button className="shareButton" type="submit">
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
