import "./chatOnline.css";

function ChatOnline() {
  return (
    <>
      <div className="chatOnline">
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img src="/assets/person/1.jpeg" className="chatOnlineImg" alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">John Doe</span>
        </div>
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img src="/assets/person/1.jpeg" className="chatOnlineImg" alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">John Doe</span>
        </div>
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img src="/assets/person/1.jpeg" className="chatOnlineImg" alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">John Doe</span>
        </div>
      </div>
    </>
  );
}

export default ChatOnline;
