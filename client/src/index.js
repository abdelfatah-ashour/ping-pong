import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { AuthProvider } from "./Context/Auth";
import { NewMessagesProvider } from "./Context/NewMessages";
import "./css/global.css";

ReactDOM.render(
  <React.Fragment>
    <AuthProvider>
      <NewMessagesProvider>
        <App />
      </NewMessagesProvider>
    </AuthProvider>
  </React.Fragment>,
  document.getElementById("root")
);
