import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import "./css/global.css";
import { AuthProvider } from "./Context-Api/Auth";
ReactDOM.render(
	<React.Fragment>
		<AuthProvider>
			<App />
		</AuthProvider>
	</React.Fragment>,
	document.getElementById("root")
);
