import React from 'react';
import {
    AiOutlineMessage,
    AiOutlineUserAdd,
    AiOutlineUserDelete,
} from 'react-icons/ai';

import { IO } from '../App';

import Cookies from 'js-cookie';

export default function OneFriend({
    props,
    friend,
    addFriend,
    deleteFriend,
    newFriend,
    isFriends,
    myNewFriends,
    setMyFriends,
}) {
    const handleRootToPrivateChat = id => {
        window.location.href = `/profile/private/${id}`;
    };

    const userInfo = Cookies.getJSON('Info');

    // handle method for send add friend
    const handleAddFriend = () => {
        IO.emit('addFriend', {
            user: userInfo,
            friend: { username: friend.username, friendId: friend._id },
        });
    };

    // handle method for send  delete Friend friend
    const handleDeleteFriend = () => {
        IO.emit('deleteFriend', userInfo, friend);
        const result = myNewFriends.filter(listFriends => {
            return listFriends._id !== friend._id;
        });
        setMyFriends(result);
    };

    const styleImageUser = {
        style: { backgroundColor: !friend.isOnline ? 'green' : '#e1e1e1' },
    };

    return (
        <div className="one-friend">
            <div className="container-image">
                <img src="/user.png" alt="user.png" />
                <span {...styleImageUser}></span>
            </div>
            <span className="username">{friend.username}</span>
            <ul className="option">
                <li
                    onClick={() =>
                        handleRootToPrivateChat(
                            isFriends ? friend.friendId : friend._id
                        )
                    }>
                    <AiOutlineMessage />
                </li>
                {addFriend ? (
                    <li onClick={handleAddFriend}>
                        <AiOutlineUserAdd />
                    </li>
                ) : null}
                {deleteFriend ? (
                    <li onClick={handleDeleteFriend}>
                        <AiOutlineUserDelete />
                    </li>
                ) : null}
            </ul>
        </div>
    );
}
