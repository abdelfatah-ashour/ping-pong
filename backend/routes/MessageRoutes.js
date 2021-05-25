const { getPrivateChat } = require("../controllers/socketControllers");
const { isAuth } = require("../controllers/userControllers");

const Router = require("express").Router();

Router.route("/message/getPrivateChat").get(isAuth, getPrivateChat);

module.exports = Router;
