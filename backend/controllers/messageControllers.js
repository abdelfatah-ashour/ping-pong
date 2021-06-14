const Message = require("../models/messageModel");

module.exports = {
  getPrivateMessages: async (req, res) => {
    try {
      const _id = req.query.friendId;
      const allMessages = await Message.find(
        {
          from: { $in: [req.user._id, _id] },
          to: { $in: [req.user._id, _id] },
        },
        (error) => {
          if (error) throw new Error(error);
        }
      ).sort({ createdAt: 1 });

      res.status(200).json({ message: allMessages });
    } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
    }
  },
};
