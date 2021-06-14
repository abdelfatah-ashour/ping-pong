import React, { useEffect, useState } from "react";
import { IO } from "../App";
import OneFriend from "../components/OneFriend";
import "../css/Home.css";

export default function Friends(props) {
  const [myNewFriends, setMyFriends] = useState([]);

  useEffect(() => {
    // change title of document
    document.title = "Friends";
    IO.emit("getFriends");
    IO.on("friends", (friends) => {
      if (friends.length > 0) {
        setMyFriends(friends[0].friends);
      }
    });
    return () => {
      setMyFriends([]);
    };
  }, []);

  useEffect(() => {
    document.title = "My Friends";
    return () => {
      return;
    };
  }, []);

  return (
    <div className="container" style={{ height: "calc(100vh - 140px)" }}>
      <main className="row d-flex justify-content-around align-content-center align-items-center">
        <section className="start-conversation col-md-8 d-md-flex d-sm-none d-xs-none">
          <p className="lead"> Start new conversation </p>
        </section>
        <section className="friends col-md-4 col-sm-10">
          <div className="list-friends">
            {/* generate ui friends */}

            {myNewFriends.length > 0 ? (
              myNewFriends.map((friend, i) => {
                return (
                  <React.Fragment key={i}>
                    {friend.state > 0 ? (
                      <OneFriend
                        friend={friend}
                        props={props}
                        deleteFriend
                        isFriends
                        setMyFriends={setMyFriends}
                        myNewFriends={myNewFriends}
                      />
                    ) : null}
                  </React.Fragment>
                );
              })
            ) : (
              <p
                className="lead w-100 text-center"
                style={{ color: "#f1f1f1" }}
              >
                you don't have friends
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
