import React, { useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { IO } from "../App";
import "../css/privateMsg.css";

export default function BoxChat({
  messsageText,
  handleSetMsg,
  handleSendMsg,
  user,
}) {
  const inputMsg = useRef();
  useEffect(() => {
    inputMsg.current.focus();
  }, []);

  return (
    <div className="input-msg w-100">
      <textarea
        name="msg-box col-11"
        cols="70"
        wrap="soft"
        autoFocus
        onChange={(e) => {
          handleSetMsg(e.target.value);
          if (e.target.value.length > 0) {
            IO.emit("send-typing", {
              status: true,
              to: user._id,
            });
          } else {
            IO.emit("send-typing", {
              status: false,
              to: user._id,
            });
          }
        }}
        value={messsageText}
        ref={inputMsg}
        className="input-textarea"
      />
      <div className="content-option col-1">
        <button
          className="send-msg"
          style={
            messsageText.length > 1
              ? { color: "rgb(0, 166, 243)" }
              : { color: "#888" }
          }
          disabled={messsageText.length > 1 ? false : true}
          onClick={handleSendMsg}
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
