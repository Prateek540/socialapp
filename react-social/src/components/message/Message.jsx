import "./message.css";
import { format } from "timeago.js";

function Message({ message, own, myProfile, otherProfile }) {
  return (
    <>
      <div className={own ? "message own" : "message"}>
        <div className="messageTop">
          <img
            src={own ? myProfile.profilePicture : otherProfile.profilePicture}
            alt=""
            className="messageImg"
          />
          <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
      </div>
    </>
  );
}

export default Message;
