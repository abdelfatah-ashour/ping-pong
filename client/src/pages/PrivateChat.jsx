import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context-Api/Auth";
import BoxChat from "../components/BoxChat";
import Message from "../components/Message"; // main message ui
import { IO } from "../App"; // get instance Socket
import API from "../API";

export default function PrivateChat({ friend, match }) {
	const { Auth } = useContext(AuthContext);
	const _id = match.params.friendId; // get friend id
	const [user, setUser] = useState(null); // All User friend was suggests
	const [Msg, setMsg] = useState(""); // input message
	const [allMessages, setAllMessages] = useState([]); // all message between 2 users
	//send message to other one
	const handleSendMsg = () => {
		const contentMsg = {
			from: Auth._id,
			to: user._id,
			content: Msg,
		};
		IO.emit("sendMessage", user, Msg);
		setAllMessages([...allMessages, contentMsg]);
		setMsg("");
	};

	// receive new message
	IO.on("newSMS", (data) => {
		setAllMessages([...allMessages, data]);
	});

	setTimeout(() => {
		const containerMessages = document.getElementById("container-messages");
		containerMessages.scrollTop = containerMessages.scrollHeight;
	}, 300);

	const fetchOneUser = async () => {
		const { data } = await API.get("/api/auth/getOneUser", {
			headers: {
				user: _id,
			},
		});
		setUser(data.message);
	};

	useEffect(() => {
		fetchOneUser();
		IO.emit("getPrivateMessage", { friendId: _id });
		IO.on("privateMessages", (data) => {
			setAllMessages([...allMessages, ...data]);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_id]);

	return (
		<div>
			<div className="privateMsg">
				<aside className="userInfo">
					<div className="content-image">
						<img src="/user.png" alt="user.png" />
					</div>
					<div className="content-info">
						<h3>{user ? user.username : null}</h3>
						<span>{user ? user.email : null}</span>
					</div>
				</aside>
				<main>
					<div className="container-msg" id="container-messages">
						{/* all message */}
						{allMessages.length === 0 ? (
							//  friendly message if no message between user and friend
							<p className="lead text-center sayHello">Say Hello 👋 </p>
						) : null}
						{/* main messages  component UI*/}
						{allMessages.map((message, i) => {
							return (
								<React.Fragment key={i}>
									{message.from === user._id ? (
										<span>{"from : " + user.username}</span>
									) : null}
									<Message message={message} id={_id} />
								</React.Fragment>
							);
						})}
					</div>
					<BoxChat
						Msg={Msg}
						setMsg={setMsg}
						handleSendMsg={handleSendMsg}
						user={user}
					/>
				</main>
			</div>
		</div>
	);
}
