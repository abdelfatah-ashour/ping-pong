import React, { useContext, useEffect, useState } from 'react';
import OneFriend from '../components/OneFriend';
import { GoSearch } from 'react-icons/go';
import { AuthContext } from '../Context-Api/Auth';
import { IO } from '../App';

export default function GetNewFriends(props) {
    const { Auth } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [friends, setFriends] = useState([]);
    const [newFriends, setNewFriends] = useState([]);

    // handle search input to change value
    const handleSearch = async e => {
        setSearch(e.target.value);

        if (e.target.value.length > 3) {
            // get new friend result of search
            if (friends.length > 0) {
                IO.emit('getNewFriend', e.target.value);
                console.log('emitted');
                IO.on('newFriend', data => {
                    console.log('newFriend  : ' + data);
                    const result = data.filter(newFriend => {
                        return friends.some(isFriend => {
                            return (
                                newFriend._id !== isFriend.friendId &&
                                newFriend._id !== Auth._id
                            );
                        });
                    });
                    setNewFriends(result);
                });
            } else {
                IO.emit('getNewFriend', e.target.value);
                console.log('emitted');
                IO.on('newFriend', data => {
                    console.log('newFriend  : ' + data);
                    const result = data.filter(newFriend => {
                        return newFriend._id !== Auth._id;
                    });
                    setNewFriends(result);
                });
            }
        }
    };

    useEffect(() => {
        IO.emit('getFriends');
        IO.on('friends', friends => {
            setFriends([...friends[0].friends]);
        });

        return () => {
            setFriends([]);
        };
    }, []);

    const styleIconSearch = {
        width: '7%',
        margin: '1.75rem 0 0 0',
        color: '#f1f1f1',
        padding: '0.2rem',
    };

    const styleInputSearch = { width: '93%' };

    const styleFriendlyMsg = {
        style: {
            color: '#f1f1f1',
            fontSize: '1.5rem',
            padding: '0.2rem 0.5rem',
        },
    };

    const propsOfInputSearch = {
        style: { ...styleInputSearch },
        type: 'search',
        className: 'search',
        name: 'search',
        value: search,
        autoComplete: 'false',
        onChange: handleSearch,
        placeholder: 'type username',
    };

    return (
        <main>
            <div className="container">
                <div className="d-flex flex-column justify-content-center  align-items-center">
                    <div className="col-md-5 col-sm-12 row d-flex  justify-content-center">
                        <span style={{ ...styleIconSearch }}>
                            <GoSearch />
                        </span>
                        <input {...propsOfInputSearch} />
                    </div>
                    <div className="col-md-4 col-sm-12 d-flex flex-column justify-content-center">
                        {newFriends.length > 0 ? (
                            <p className="lead text-center">
                                result ({newFriends.length})
                            </p>
                        ) : null}
                        {newFriends.map((friend, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <OneFriend
                                        friend={friend}
                                        props={props}
                                        addFriend
                                        newFriend
                                    />
                                </React.Fragment>
                            );
                        })}
                        {search.length === 0 || search.length < 3 ? (
                            <p
                                className="lead text-center text-capitalize"
                                {...styleFriendlyMsg}>
                                Please enter at least 3 characters to search...
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </main>
    );
}
