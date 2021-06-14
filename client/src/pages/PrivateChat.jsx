import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import axios from "../API";
import { IO } from "../App";
import BoxChat from "../components/BoxChat";
import Message from "../components/Message";
import { AuthContext } from "../Context/Auth";

export default function PrivateChat({ match }) {
  const { Auth } = useContext(AuthContext);
  const [user, setUser] = useState(null); // friend
  const [Msg, setMsg] = useState(""); // message
  const [allMessages, setAllMessages] = useState([]); // all message between 2 users
  const [type, setType] = useState(false);
  const _id = match.params.friendId;

  IO.on("recieve-typing", (status) => {
    setType(status);
  });

  //send message to other one
  const handleSendMsg = () => {
    const contentMsg = {
      from: Auth._id,
      to: user._id,
      content: Msg,
    };
    IO.emit("sendMessage", user, Msg);
    setAllMessages([...allMessages, contentMsg]);
    setMsg("");
  };

  async function getOneUser() {
    await axios
      .get("/api/auth/getOneUser", {
        params: {
          friendId: _id,
        },
        headers: {
            authorization: Cookies.get("authorization"),
        },
      })
      .then(({ data }) => {
        setUser(data.message);
      })
      .catch((error) => {
        if (!error.response) {
          console.log("Error : " + error.message);
        } else {
          console.log(error.response.data.message);
        }
      });
  }

  useEffect(() => {
    getOneUser();
    return () => {
      setUser(null);
    };
  }, [_id]);

  async function getPrivateMessages() {
    await axios
      .get("/api/message/getPrivateChat", {
        params: {
          friendId: _id,
        },
      })
      .then(({ data }) => {
        setAllMessages([...data.message]);
      })
      .catch((error) => {
        if (!error.response) {
          console.log(error.message);
        } else {
          console.log(error.response.data.message);
        }
      });
  }

  useEffect(() => {
    getPrivateMessages();
    return () => {
      setAllMessages([]);
    };
  }, [_id]);

  // receive new message
  IO.on("newSMS", (data) => {
    setAllMessages([...allMessages, data]);
    setType(false);
  });

  setTimeout(() => {
    const containerMessages = document.getElementById("container-messages");
    containerMessages.scrollTop = containerMessages.scrollHeight;
  }, 500);

  useEffect(() => {
    if (user) {
      document.title = user.username;
      return () => {
        return;
      };
    } else {
      document.title = _id;
    }
  }, [user]);

  return (
    <div className="container" style={{ height: "calc(100vh - 140px)" }}>
      <div className="privateMsg d-flex justify-content-around">
        <div className="row justify-content-between w-100">
          <aside className="userInfo d-none d-md-flex col-md-3">
            <div className="content-image">
              <img src="/user.png" alt="user.png" />
            </div>
            <div className="content-info">
              <h3>{user ? user.username : null}</h3>
              <span>{user ? user.email : null}</span>
            </div>
          </aside>
          <main className="col-md-8 col-12 d-flex flex-wrap justify-content-center">
            <div className="container-msg w-100" id="container-messages">
              {/* all message */}
              {allMessages.length === 0 ? (
                //  friendly message if no message between user and friend
                <p className="lead text-center sayHello">Say Hello 👋</p>
              ) : null}
              {/* main messages  component UI*/}
              {allMessages.map((message, i) => {
                return (
                  <React.Fragment key={i}>
                    <Message message={message} id={_id} />
                  </React.Fragment>
                );
              })}
              {type && (
                <div className="w-100 text-dark d-flex justify-content-start align-content-center p-2 ">
                  <div className="typing-wrapper">
                    <span className="typing">type</span>
                    <span className="wrapper-dot">
                      <small></small>
                      <small></small>
                      <small></small>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <BoxChat
              messsageText={Msg}
              handleSetMsg={setMsg}
              handleSendMsg={handleSendMsg}
              user={user}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
