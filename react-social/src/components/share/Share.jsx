import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useContext, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { AuthContext } from "../../context/AuthContext";

export default function Share({ username }) {
  const { currentUser } = useContext(AuthContext);
  const text = `What's in your mind ${currentUser.username}`;

  const [file, setFile] = useState(null);
  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {username === currentUser.username || !username ? (
        <div className="share">
          <div className="shareWrapper">
            <div className="shareTop">
              <img
                src={`/${currentUser.profilePicture}`}
                className="shareProfileImg"
                alt=""
              />
              <input type="text" className="shareInput" placeholder={text} />
            </div>
            <hr className="shareHr" />
            {file && (
              <div className="shareImgContainer">
                <img
                  className="shareImg"
                  src={URL.createObjectURL(file)}
                  alt=""
                />
                <CancelIcon
                  className="shareCancelImg"
                  onClick={() => setFile(null)}
                />
              </div>
            )}
            <form className="shareBottom" onSubmit={submitHandler}>
              <div className="shareOptions">
                <label htmlFor="file" className="shareOption">
                  <PermMediaIcon htmlColor="red" className="shareIcon" />
                  <span className="shareOptionText">Photo or Video</span>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => setFile(e.target.files[0])}
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
