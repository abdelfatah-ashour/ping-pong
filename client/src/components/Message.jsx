import React from "react";

export default function Message({ message, id }) {
  return (
    <div
      className={
        message.from === id // message from  friend
          ? "w-100 d-flex justify-content-start align-items-center"
          : "w-100 d-flex justify-content-end align-items-center"
      }
    >
      <div
        className={
          message.from === id // message from  friend
            ? "line-msg-from align-items-center"
            : "line-msg-to align-items-center" // message from  user
        }
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
}
