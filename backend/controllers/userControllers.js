const User = require('../models/userModel');
const { validLogin, validRegister } = require('../helpers/validUser');
const { hash, compare } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = {
    register: async (req, res) => {
        const { username, email, password } = req.body;
        const { error } = validRegister(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        // find email if already exist
        await User.findOne({ email }, null, null, async (err, user) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: 'email is already exists',
                });
            }
            const hashed = await hash(password, 12);
            const createNewUser = new User({
                username,
                email,
                password: hashed,
            });

            await createNewUser.save(err => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'created new account successfully',
                });
            });
        });
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        const { error } = validLogin(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        try {
            // check if user have account
            await User.findOne({ email }, null, null, async (err, user) => {
                // error with sever
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }
                // no found email
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: 'email is not exists yet',
                    });
                }

                await compare(password, user.password, async (err, same) => {
                    // err server
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }

                    // if password not matching
                    if (!same) {
                        return res.status(401).json({
                            success: false,
                            message: 'email or password incorrect 🥴',
                        });
                    }
                    // generate token
                    const userToken = sign(
                        {
                            _id: user._id,
                            email: user.email,
                        },
                        process.env.ACCESS_TOKEN ||
                            'asdadadasdasdaslfbzxkjhfkjhaloikklasjdop;'
                    );

                    res.setHeader(
                        'Set-Cookie',
                        cookie.serialize('auth', userToken, {
                            httpOnly: process.env.NODE_ENV === 'production',
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: process.env.NODE_ENV === 'production',
                            path: '/',
                            maxAge: 1 * 24 * 60 * 60, // 1 day})
                        })
                    );
                    // change user state to online
                    await User.findOneAndUpdate({ email }, { isOnline: true });
                    return res.status(200).json({
                        success: true,
                        message: {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                        },
                    });
                });
            });
        } catch (error) {
            if (error) {
                throw new Error(error.message);
            }
        }
    },
    logout: async (req, res) => {
        // change state user to offline
        await User.findOneAndUpdate(
            { _id: req.params._id },
            {
                isOnline: false,
            },
            { new: true }
        );

        // clear cookie
        res.clearCookie('auth');
        res.status(200).json({
            success: true,
            message: 'see you later 🥰',
        });
    },
    isAuth: async (req, res, next) => {
        const user = req.cookies.auth;
        try {
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "you can't access this resources 🥴",
                });
            }
            const decoded = await verify(user, process.env.ACCESS_TOKEN);
            if (!decoded) {
                res.status(401).json({
                    success: false,
                    message: 'must be login or register 🤟',
                });
            }
            req.user = decoded;
            // eslint-disable-next-line callback-return
            next();
        } catch (error) {
            res.status(403).json({
                success: false,
                message: 'forbidden access 😤',
            });
        }
    },

    // get specific user
    getOneUser: async (req, res) => {
        const _id = req.headers.user;
        try {
            await User.findOne({ _id }, null, { new: true }, (err, user) => {
                if (err) {
                    throw new Error(err.message);
                }
                return res.status(200).json({
                    success: true,
                    message: user,
                });
            });
        } catch (error) {
            if (error) throw new Error(error.message);
        }
    },
};
