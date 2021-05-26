import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context-Api/Auth';
import { FaUserFriends } from 'react-icons/fa';
import { TiMessages, TiUserDelete } from 'react-icons/ti';
import { BsPersonCheckFill } from 'react-icons/bs';
import { IO } from '../App';
import '../css/bar.css';

export default function Bar() {
    const { Auth } = useContext(AuthContext);
    const [fetchedFriendRequests, setFetchedFriendRequests] = useState([]);

    const handleAcceptFriend = friend => {
        const user = { _id: Auth._id, username: Auth.username };
        IO.emit('acceptFriend', user, {
            username: friend.username,
            friendId: friend.friendId,
        });
        const lastResult = fetchedFriendRequests.filter(isFriend => {
            return isFriend.friendId !== friend.friendId;
        });

        setFetchedFriendRequests(lastResult);
    };

    const handleCancelRequestFriend = friend => {
        const user = { _id: Auth._id, username: Auth.username };
        IO.emit('cancelRequestFriend', user, {
            username: friend.username,
            friendId: friend.friendId,
        });
        const lastResult = fetchedFriendRequests.filter(isFriend => {
            return isFriend.friendId !== friend.friendId;
        });
        setFetchedFriendRequests(lastResult);
    };

    IO.on('emitFriendRequest', data => {
        setFetchedFriendRequests([...fetchedFriendRequests, data]);
    });

    IO.on('getListFriendRequests', data => {
        if (data.length > 0) {
            const result = data[0].friends.filter(friends => {
                return friends.state === 0;
            });
            setFetchedFriendRequests(result);
        }
    });

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
                            aria-expanded="false">
                            <FaUserFriends />
                            {fetchedFriendRequests.length > 0 && (
                                <span>{fetchedFriendRequests.length}</span>
                            )}
                        </span>
                        <div
                            className="dropdown-menu"
                            aria-labelledby="notificationDownDown">
                            {fetchedFriendRequests.length > 0
                                ? fetchedFriendRequests.map((friend, i) => {
                                      return (
                                          <React.Fragment key={i}>
                                              <div className="line-notification">
                                                  <div className="content-image-of-notification">
                                                      <img
                                                          src="/user.png"
                                                          alt="user.png"
                                                      />
                                                  </div>
                                                  <div className="content-info-of-notification">
                                                      <div>
                                                          {friend.username}
                                                      </div>
                                                      <div className="container-icons">
                                                          <span
                                                              className="accept"
                                                              onClick={() =>
                                                                  handleAcceptFriend(
                                                                      friend
                                                                  )
                                                              }>
                                                              <BsPersonCheckFill />{' '}
                                                              accept
                                                          </span>
                                                          <span
                                                              className="cancel"
                                                              onClick={() =>
                                                                  handleCancelRequestFriend(
                                                                      friend
                                                                  )
                                                              }>
                                                              <TiUserDelete />{' '}
                                                              cancel
                                                          </span>
                                                      </div>
                                                  </div>
                                              </div>
                                          </React.Fragment>
                                      );
                                  })
                                : null}

                            {fetchedFriendRequests.length === 0 ? (
                                <p className="lead text-center m-0">
                                    not have friend request
                                </p>
                            ) : null}
                        </div>
                    </li>
                    <li className="nav-item dropdown" name="messages">
                        <span
                            className="nav-link dropdown-toggle"
                            id="messageDropDown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <TiMessages />
                        </span>
                        <ul
                            className="dropdown-menu"
                            aria-labelledby="messageDropDown">
                            <li>
                                <p
                                    className="lead text-center m-0"
                                    style={{ color: '#121212' }}>
                                    Messages Empty 📪
                                </p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}
