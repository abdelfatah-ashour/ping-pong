const { isAuth } = require("../controllers/userControllers");
const { getPrivateMessages } = require("../controllers/messageControllers");
const Router = require("express").Router();

Router.route("/message/getPrivateChat").get(isAuth, getPrivateMessages);

module.exports = Router;
