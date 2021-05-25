import React, { useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { IO } from "../App";
import "../css/privateMsg.css";

export default function BoxChat({ Msg, setMsg, handleSendMsg, user }) {
	const inputMsg = useRef();

	// handle change  on box msg
	const handleChangeBoxMsg = (e) => {
		setMsg(e.target.value);
		if (Msg.length === 0) {
			IO.emit("noType", false, user);
		}
		if (Msg.length + 1 > 0) {
			IO.emit("type", true, user);
		}
	};
	useEffect(() => {
		inputMsg.current.focus();
	}, []);

	return (
		<div className="input-msg">
			<textarea
				name="msg-box"
				cols="70"
				wrap="soft"
				autoFocus
				onChange={handleChangeBoxMsg}
				value={Msg}
				ref={inputMsg}
			/>
			<div className="content-option">
				<span
					className="send-msg"
					style={
						Msg.length >= 1 ? { color: "rgb(0, 166, 243)" } : { color: "#888" }
					}
					onClick={() => {
						if (Msg.length >= 1) {
							handleSendMsg();
						}
					}}
					disabled={Msg?.length <= 0 ? true : false}
				>
					<FiSend />
				</span>
			</div>
		</div>
	);
}
