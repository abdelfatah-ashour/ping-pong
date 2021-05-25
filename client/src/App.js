import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContext } from './Context-Api/Auth';
import Home from './pages/Home';
import Layout from './components/Layout';
import Friends from './pages/Friends';
import GetNewFriends from './pages/GetNewFriends';
import PrivateChat from './pages/PrivateChat';
import Register from './pages/Register';
import Login from './pages/Login';
import Error from './pages/Error';
import { HEROKU } from './keys.json';
import { io } from 'socket.io-client';

// handle Socket socket
export const IO = io(HEROKU, {
    withCredentials: true,
    transports: ['websocket'],
});

export default function App() {
    const { Auth } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <div className="App">
                <Layout>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route
                            path="/register"
                            component={!Auth.isUser ? Register : Home}
                        />
                        <Route
                            path="/login"
                            component={!Auth.isUser ? Login : Home}
                        />
                        <Route
                            path="/friends"
                            component={!Auth.isUser ? Login : Friends}
                        />
                        <Route
                            path="/get-new-friends"
                            component={!Auth.isUser ? Login : GetNewFriends}
                        />
                        <Route
                            exact
                            path="/profile/private/:friendId"
                            component={!Auth.isUser ? Login : PrivateChat}
                        />
                        <Route component={Error} />
                    </Switch>
                </Layout>
            </div>
        </BrowserRouter>
    );
}
