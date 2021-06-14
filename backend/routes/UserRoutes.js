const router = require("express").Router();
const {
  login,
  register,
  logout,
  getOneUser,
} = require("../controllers/userControllers");

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/auth/logout").get(logout);
router.route("/auth/getOneUser").get(getOneUser);

module.exports = router;
