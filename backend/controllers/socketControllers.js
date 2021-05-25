const User = require('../models/userModel');
const Message = require('../models/messageModel');

// there all middleware to more clean and readable code
module.exports = {
    // create new message in database
    createNewMessage: async (req, data, content) => {
        try {
            const newMessage = new Message({
                from: req.user._id,
                to: data._id,
                content: content,
            });
            await newMessage.save(err => {
                if (err) {
                    throw new Error(err.message);
                }
            });
            return newMessage;
        } catch (error) {
            if (error) {
                throw new Error(error.message);
            }
        }
    },
    getOneUser: async _id => {
        try {
            return await User.findOne({ _id }).select('_id username email');
        } catch (error) {
            if (error) throw new Error(error.message);
        }
    },
    // get private message
    getPrivateChat: async (userId, friendId) => {
        try {
            // this state user is sender
            let send = await Message.find({
                from: userId,
                to: friendId,
            });

            // this state user is receiver
            let receive = await Message.find({
                from: friendId,
                to: userId,
            });

            // let all message in one array and max all message
            const pushing = [...send, ...receive];
            // sort all message
            const resultOfSorting = pushing.sort((a, b) => {
                return a.createdAt - b.createdAt;
            });

            return resultOfSorting;
        } catch (error) {
            if (error) throw new Error(error.message);
        }
    },
    //  search about new friend
    getNewFriends: async username => {
        try {
            return await User.find({
                username: `/${username}/i`,
            }).select('_id username imageProfile');
        } catch (error) {
            if (error) throw new Error(error.message);
            return { msg: error.message };
        }
    },
    // get my friends
    getFriends: async _id => {
        try {
            const friends = await User.find({ _id }).select('friends');
            return friends;
        } catch (error) {
            if (error) throw new Error(error.message);
            return { msg: error.message };
        }
    },
    // add new friend
    addFriend: async (user, friend) => {
        try {
            await User.updateOne(
                {
                    _id: friend.friendId,
                },
                {
                    $addToSet: {
                        friends: {
                            friendId: user._id,
                            username: user.username,
                            state: 0,
                        },
                    },
                },
                { new: true },
                (err, docs) => {
                    if (err) throw new Error(err.message);
                }
            );

            return user;
        } catch (error) {
            if (error) throw new Error(error.message);
        }
    },
    // accept friend request
    acceptFriend: async (user, friend) => {
        try {
            // add new friend with update friends field
            const isUser = await User.findOne({
                _id: user._id,
                'friends.friendId': friend.friendId,
            });

            if (isUser) {
                isUser.friends[0].state = 1;
                await isUser.save(err => {
                    if (err) throw new Error(err.message);
                });
            }

            // get friend document and  add user in friends field
            await User.findOneAndUpdate(
                { _id: friend.friendId },
                {
                    $addToSet: {
                        friends: {
                            username: user.username,
                            state: 1,
                            friendId: user._id,
                        },
                    },
                },
                { new: true },
                (err, docs) => {
                    if (err) throw Error(err.message);
                }
            );
        } catch (error) {
            if (error) throw new Error(error.message);
        }
    },
    // cancel friend request
    cancelFriend: async (user, friend) => {
        try {
            await User.findByIdAndUpdate(
                {
                    _id: user._id,
                },
                {
                    $pull: { friends: { friendId: friend.friendId } },
                },
                { new: true },
                (err, docs) => {
                    if (err) throw new Error(err.message);
                }
            );
        } catch (error) {
            if (error) throw new Error(error.message);
        }
    },
    // delete friend
    deleteFriend: async (user, friend) => {
        try {
            await User.findByIdAndUpdate(
                {
                    _id: user._id,
                },
                {
                    $pull: { friends: { friendId: friend.friendId } },
                },
                { new: true },
                (err, docs) => {
                    if (err) throw new Error(err.message);
                }
            );

            await User.findByIdAndUpdate(
                {
                    _id: friend.friendId,
                },
                {
                    $pull: { friends: { friendId: user._id } },
                },
                { new: true },
                (err, docs) => {
                    if (err) throw new Error(err.message);
                }
            );
        } catch (error) {
            if (error) throw new Error(error.message);
        }
    },
    getFriendRequest: async _id => {
        try {
            return await User.find({
                _id,
            }).select('friends');
        } catch (error) {
            if (error) throw new Error(error.message);
        }
    },
};
