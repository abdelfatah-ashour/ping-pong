const User = require("../models/userModel");
const Message = require("../models/messageModel");

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
      await newMessage.save((err) => {
        if (err) {
          throw new Error(err.message);
        }
      });
      const findMessage = await Message.findOne({
        _id: newMessage._id,
      })
        .populate("from", "_id username imageProfile")
        .populate("to", "_id username imageProfile");

      return { newMessage, findMessage };
    } catch (error) {
      console.log(error.message);
    }
  },
  getOneUser: async (_id) => {
    const result = await User.findOne({ _id }).select("_id username email");
    return result;
  },
  //  search about new friend
  getNewFriends: async (username) => {
    try {
      const result = await User.find({
        username: { $regex: username, $options: "i" },
      })
        .select("_id username imageProfile")
        .limit(5);
      return result;
    } catch (error) {
      console.log(error.message);
      return { msg: error.message };
    }
  },
  // get my friends
  getFriends: async (_id) => {
    try {
      const friends = await User.find({ _id }).select("friends");
      return friends;
    } catch (error) {
      console.log(error.message);
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
        (err) => {
          if (err) throw new Error(err.message);
        }
      );

      return user;
    } catch (error) {
      console.log(error.message);
    }
  },
  // accept friend request
  acceptFriend: async (user, friend) => {
    try {
      // add new friend with update friends field
      await User.updateOne(
        {
          _id: user._id,
          "friends.friendId": friend.friendId,
        },
        {
          "friends.$.state": 1,
        },
        {
          new: true,
        },
        async (error) => {
          if (error) throw new Error(error);

          await User.updateOne(
            {
              _id: friend.friendId,
            },
            {
              $addToSet: {
                friends: {
                  friendId: user._id,
                  username: user.username,
                  state: 1,
                },
              },
            },
            {
              new: true,
            },
            (error) => {
              if (error) throw new Error(error);
            }
          );
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  },
  // cancel friend request
  cancelFriend: async (user, friend) => {
    try {
      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $pull: { friends: { friendId: friend.friendId } },
        },
        { new: true },
        (err) => {
          if (err) throw new Error(err.message);
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  },
  // delete friend
  deleteFriend: async (user, friend) => {
    try {
      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $pull: { friends: { friendId: friend.friendId } },
        },
        { new: true },
        async (err) => {
          if (err) throw new Error(err.message);

          await User.updateOne(
            { _id: friend.friendId },
            { $pull: { friends: { friendId: user._id } } },
            { new: true },
            (error) => {
              if (error) throw new Error(error);
            }
          );
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
        (err) => {
          if (err) throw new Error(err.message);
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  },
  getFriendRequest: async (_id) => {
    try {
      return await User.find({
        _id,
      }).select("friends");
    } catch (error) {
      console.log(error.message);
    }
  },
};
