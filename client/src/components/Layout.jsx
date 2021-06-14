import Cookies from "js-cookie";
import React, { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { AuthContext } from "../Context/Auth";
import Bar from "./Bar";

export default function Layout({ children }) {
  const { Auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (Cookies.getJSON("Info")) {
      const { _id, username } = Cookies.getJSON("Info");
      setAuth({
        ...Auth,
        isUser: true,
        _id: _id,
        username: username,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Auth.isUser ? <Bar /> : null}

      <Navbar />
      {/* container of toaster */}
      <ToastContainer
        position="bottom-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {children}
    </>
  );
}
