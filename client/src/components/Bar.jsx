import React, { useContext, useEffect, useState } from "react";
import { BsPersonCheckFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { TiMessages, TiUserDelete } from "react-icons/ti";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { IO } from "../App";
import { AuthContext } from "../Context/Auth";
import { NewMessagesStore } from "../Context/NewMessages";
import "../css/bar.css";
export default function Bar() {
  const [countNewMessages, setCountNewMessages] = useState(0);
  const { Messages, setMessages } = useContext(NewMessagesStore);
  const { Auth } = useContext(AuthContext);
  const [fetchedFriendRequests, setFetchedFriendRequests] = useState([]);
  const location = useLocation();
  let history = useHistory();

  IO.on("newSMS-notification", (newMessages) => {
    if (!location.pathname.includes("/profile/private")) {
      let arr = [];
      // return old array messages without new message
      let oldArr = Messages.filter((oldMsg) => {
        return oldMsg.from !== newMessages.from;
      });
      arr = [
        ...oldArr,
        {
          _id: newMessages._id,
          from: {
            id: newMessages.from._id,
            username: newMessages.from.username,
            imageProfile: newMessages.from.imageProfile,
          },
          to: {
            id: newMessages.to._id,
            username: newMessages.to.username,
            imageProfile: newMessages.to.imageProfile,
          },
          content: newMessages.content,
          createdAt: newMessages.createdAt,
          updatedAt: newMessages.updatedAt,
          __v: newMessages.__v,
          opened: false,
        },
      ];
      return setMessages(arr);
    }
  });

  const handleAcceptFriend = (friend) => {
    const user = { _id: Auth._id, username: Auth.username };
    IO.emit("acceptFriend", user, {
      username: friend.username,
      friendId: friend.friendId,
    });
    const lastResult = fetchedFriendRequests.filter((isFriend) => {
      return isFriend.friendId !== friend.friendId;
    });

    setFetchedFriendRequests(lastResult);
  };

  const handleCancelRequestFriend = (friend) => {
    const user = { _id: Auth._id, username: Auth.username };
    IO.emit("cancelRequestFriend", user, {
      username: friend.username,
      friendId: friend.friendId,
    });
    const lastResult = fetchedFriendRequests.filter((isFriend) => {
      return isFriend.friendId !== friend.friendId;
    });
    setFetchedFriendRequests(lastResult);
  };

  IO.on("emitFriendRequest", (data) => {
    setFetchedFriendRequests([...fetchedFriendRequests, data]);
  });

  IO.on("getListFriendRequests", (data) => {
    if (data.length > 0) {
      const result = data[0].friends.filter((friends) => {
        return friends.state === 0;
      });
      setFetchedFriendRequests(result);
    }
  });

  const handletoggleOpenedMessages = () => {
    setCountNewMessages(0);
  };

  useEffect(() => {
    const count = Messages.filter((msg) => {
      return msg.opened === false;
    });
    setCountNewMessages(count.length);
    return () => {
      return;
    };
  }, [Messages]);

  const redirectToChat = (url) => {
    history.push(url);
  };

  return (
    <div className="row">
      <div className="container">
        <ul className="list-Notification">
          <li className="nav-item dropdown" name="friendRequests">
            <span
              className="nav-link dropdown-toggle"
              id="notificationDownDown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserFriends />
              {fetchedFriendRequests.length > 0 && (
                <span>{fetchedFriendRequests.length}</span>
              )}
            </span>
            <div
              className="dropdown-menu"
              aria-labelledby="notificationDownDown"
            >
              {fetchedFriendRequests.length > 0
                ? fetchedFriendRequests.map((friend, i) => {
                    return (
                      <React.Fragment key={i}>
                        <div className="line-notification">
                          <div className="content-image-of-notification">
                            <img src="/user.png" alt="user.png" />
                          </div>
                          <div className="content-info-of-notification">
                            <div>{friend.username}</div>
                            <div className="container-icons">
                              <div className="accept">
                                <span
                                  onClick={() => handleAcceptFriend(friend)}
                                >
                                  <BsPersonCheckFill /> accept
                                </span>
                              </div>
                              <div className="cancel">
                                <span
                                  onClick={() =>
                                    handleCancelRequestFriend(friend)
                                  }
                                >
                                  <TiUserDelete /> cancel
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                : null}

              {fetchedFriendRequests.length === 0 ? (
                <p className="lead text-center m-0">👨‍👨‍👦 friend requests 0</p>
              ) : null}
            </div>
          </li>
          <li
            className="nav-item dropdown"
            name="messages"
            onMouseUp={handletoggleOpenedMessages}
          >
            <span
              className={
                countNewMessages > 0
                  ? "nav-link dropdown-toggle countNewMessages"
                  : "nav-link dropdown-toggle"
              }
              id="messageDropDown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-count={countNewMessages}
            >
              <TiMessages />
            </span>
            <ul className="dropdown-menu" aria-labelledby="messageDropDown">
              {Messages.length === 0 && (
                <li>
                  <p
                    className="lead text-center m-0"
                    style={{ color: "#121212" }}
                  >
                    📪 New Messages 0
                  </p>
                </li>
              )}

              {Messages.length > 0 &&
                Messages.map((msg, i) => {
                  return (
                    <li
                      key={i}
                      className="new-message"
                      onClick={() =>
                        redirectToChat("/profile/private/" + msg.from.id)
                      }
                    >
                      <span className="image-friend">
                        <img src={"/" + msg.from.imageProfile} alt="username" />
                      </span>
                      <span
                        className="lead text-center m-0 content-message"
                        style={{ color: "#121212" }}
                      >
                        {msg.content.length > 55
                          ? msg.content.slice(55) + " ..."
                          : msg.content}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
