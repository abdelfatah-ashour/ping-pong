const router = require('express').Router();
const {
    login,
    register,
    logout,
    isAuth,
    getOneUser,
    getPrivateMessages,
} = require('../controllers/userControllers');

router.route('/auth/register').post(register);
router.route('/auth/login').post(login);
router.route('/auth/logout').get(logout);
router.route('/auth/getOneUser').get(getOneUser);
router.route('/auth/getPrivateMessages').get(isAuth, getPrivateMessages);

module.exports = router;
