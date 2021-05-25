import React from "react";

export default function Message({ message, id }) {
	return (
		<div
			className={
				message.from !== id // message from  user
					? "w-100 d-flex justify-content-end"
					: "w-100 d-flex justify-content-start"
			}
		>
			<div
				className={
					message.from === id
						? "line-msg-from  secondary-text"
						: "line-msg-to  primary-text" // message from  user
				}
			>
				<p>{message.content}</p>
			</div>
		</div>
	);
}
