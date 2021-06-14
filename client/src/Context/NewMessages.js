import { createContext, useState } from "react";

export const NewMessagesStore = createContext();

export function NewMessagesProvider({ children }) {
  const [Messages, setMessages] = useState([]);
  return (
    <NewMessagesStore.Provider
      value={{
        Messages,
        setMessages,
      }}
    >
      {children}
    </NewMessagesStore.Provider>
  );
}
