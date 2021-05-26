import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context-Api/Auth';
import BoxChat from '../components/BoxChat';
import Message from '../components/Message'; // main message ui
import { IO } from '../App'; // get instance Socket
import API from '../API';
import axios from '../API';

export default function PrivateChat({ friend, match }) {
    const { Auth } = useContext(AuthContext);
    const _id = match.params.friendId; // get friend id
    const [user, setUser] = useState(null); // All User friend was suggests
    const [Msg, setMsg] = useState(''); // input message
    const [allMessages, setAllMessages] = useState([]); // all message between 2 users

    //send message to other one
    const handleSendMsg = () => {
        const contentMsg = {
            from: Auth._id,
            to: user._id,
            content: Msg,
        };
        IO.emit('sendMessage', user, Msg);
        setAllMessages([...allMessages, contentMsg]);
        setMsg('');
    };

    useEffect(async () => {
        await axios
            .get('/api/auth/getOneUser', {
                params: {
                    friendId: _id,
                },
            })
            .then(({ data }) => {
                setUser(data.message);
            })
            .catch(error => {
                if (!error.response) {
                    console.log('Error : ' + error.message);
                } else {
                    console.log(error.response.data.message);
                }
            });
    }, []);

    useEffect(() => {
        axios
            .get('/api/auth/getPrivateMessages', {
                params: {
                    friendId: _id,
                },
            })
            .then(({ data }) => {
                setAllMessages([...data.message]);
            })
            .catch(error => {
                if (!error.response) {
                    console.log(error.message);
                } else {
                    console.log(error.response.data.message);
                }
            });
        return () => {
            setAllMessages([]);
        };
    }, [_id]);

    // receive new message
    IO.on('newSMS', data => {
        setAllMessages([...allMessages, data]);
    });

    setTimeout(() => {
        const containerMessages = document.getElementById('container-messages');
        containerMessages.scrollTop = containerMessages.scrollHeight;
    }, 500);

    return (
        <div>
            <div className="privateMsg">
                <aside className="userInfo">
                    <div className="content-image">
                        <img src="/user.png" alt="user.png" />
                    </div>
                    <div className="content-info">
                        <h3>{user ? user.username : null}</h3>
                        <span>{user ? user.email : null}</span>
                    </div>
                </aside>
                <main>
                    <div className="container-msg" id="container-messages">
                        {/* all message */}
                        {allMessages.length === 0 ? (
                            //  friendly message if no message between user and friend
                            <p className="lead text-center sayHello">
                                Say Hello 👋
                            </p>
                        ) : null}
                        {/* main messages  component UI*/}
                        {allMessages.map((message, i) => {
                            return (
                                <React.Fragment key={i}>
                                    {message.from === user._id ? (
                                        <span>{'from : ' + user.username}</span>
                                    ) : null}
                                    <Message message={message} id={_id} />
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <BoxChat
                        Msg={Msg}
                        setMsg={setMsg}
                        handleSendMsg={handleSendMsg}
                        user={user}
                    />
                </main>
            </div>
        </div>
    );
}
