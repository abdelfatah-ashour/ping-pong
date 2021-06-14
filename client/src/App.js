import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { io } from "socket.io-client";
import Layout from "./components/Layout";
import { AuthContext } from "./Context/Auth";
import { HEROKU } from "./keys.json";
import Error from "./pages/Error";
import Friends from "./pages/Friends";
import GetNewFriends from "./pages/GetNewFriends";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateChat from "./pages/PrivateChat";
import Register from "./pages/Register";

// handle Socket socket
export const IO = io(HEROKU, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function App() {
  const { Auth } = useContext(AuthContext);

  useEffect(() => {
    IO.on("connect", () => {
      console.log("connected socket");
    });
    IO.on("disconnect", () => {
      console.log("disconnect socket");
    });
    IO.on("error", (e) => {
      console.log(e);
    });
    return () => {
      return;
    };
  }, []);

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
            <Route path="/login" component={!Auth.isUser ? Login : Home} />
            <Route path="/friends" component={!Auth.isUser ? Login : Friends} />
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
