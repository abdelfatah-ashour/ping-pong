// initial config
require('dotenv').config({ path: './config/.env' });

const express = require('express');
const app = express();
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const CookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const { connectDb } = require('./config/db');

const {
    getFriends,
    createNewMessage,
    getNewFriends,
    addFriend,
    acceptFriend,
    deleteFriend,
    getPrivateChat,
    cancelFriend,
    getFriendRequest,
} = require('./controllers/socketControllers');

const cookie = require('cookie');

const { verify } = require('jsonwebtoken');

// connecting to database

connectDb(process.env.DB_URL)
    .then(() => {
        console.log('connected Database');
    })
    .catch(error => {
        throw new Error(error.message);
    });

// cors policy
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
        path: '/',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);

// generate socket io server
const IO = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        credentials: true,
    },
});

// socket io
IO.on('connection', async socket => {
    console.log('connected to socket io in backend side ✔');
    const { request } = socket;
    const token = cookie.parse(request.headers.cookie);

    if (token.auth) {
        // parse cookie from req.headers.cookie === String to we should parse it
        // verify token to get decoded of jwt token
        const decoded = verify(token.auth, process.env.ACCESS_TOKEN);
        // set user obj into req object
        request.user = decoded;

        // generate room for any user to get any data from eny user with emit events
        socket.join(request.user._id);

        const getListFriendRequests = await getFriendRequest(request.user._id);

        socket.emit('getListFriendRequests', getListFriendRequests);

        socket.on('getFriends', async () => {
            const friends = await getFriends(request.user._id);
            socket.emit('friends', friends);
        });

        socket.on('getNewFriend', async username => {
            const newFriend = await getNewFriends(username);
            socket.emit('newFriend', newFriend);
        });

        // add new friend
        socket.on('addFriend', async ({ user, friend }) => {
            const result = await addFriend(user, friend);
            IO.to(friend.friendId).emit('emitFriendRequest', result);
            socket.emit('friendRequestSended', true);
        });

        socket.on('acceptFriend', async (user, friend) => {
            await acceptFriend(user, friend);
        });

        socket.on('cancelRequestFriend', async (user, friend) => {
            await cancelFriend(user, friend);
        });

        socket.on('deleteFriend', async (user, friend) => {
            await deleteFriend(user, friend);
        });

        socket.on('getPrivateMessage', async ({ friendId }) => {
            const privateMessage = await getPrivateChat(
                request.user._id,
                friendId
            );
            socket.emit('privateMessages', privateMessage);
        });

        socket.on('sendMessage', async (user, content) => {
            const newMessage = await createNewMessage(request, user, content);
            IO.to(user._id).emit('newSMS', newMessage);
        });
    }
});

// setup config of req
app.use(express.json()); // req.body json
app.use(express.urlencoded({ extended: false }));
app.use(CookieParser()); // req.cookie
app.use(helmet());

// set morgan for help me in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// setup routing here
app.use('/api', require('./routes/UserRoutes'));
app.use('/api', require('./routes/MessageRoutes'));

// listen backend server on port 9000
const PORT = process.env.PORT || 9000;
server.listen(PORT, () =>
    console.log(`server backend is working on port ${PORT}`)
);