import Cookies, { get, getJSON, remove } from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../API";
import { AuthContext } from "../Context/Auth";
import "../css/navbar.css";

export default function Navbar(props) {
  const { Auth, setAuth } = useContext(AuthContext);
  const [animation, setAnimation] = useState(false);
  let history = useHistory();

  const handleAnimationToggle = () => {
    if (animation) {
      setAnimation(false);
    } else {
      setAnimation(true);
    }
  };

  useEffect(() => {
    if (get("auth") && getJSON("Info")) {
      const { _id, username } = getJSON("Info");
      setAuth({ isUser: true, _id, username });
    }
  }, [setAuth]);

  const handleLogout = async () => {
    await API.get("/api/auth/logout", {
      params: {
        userId: Auth._id,
      },
      headers: {
        authorization: Cookies.get("authorization"),
      },
    })
      .then(({ data }) => {
        remove("Info");
        remove("authorization");
        setAuth({ isUser: null, username: null, _id: null });
        // if success display toaster friendly show success message
        toast.success("🦄 " + data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          history.push("/");
        }, 1500);
      })
      .catch((error) => {
        // if there any error display toaster friendly show Error message
        if (!error.response) {
          console.log(error.message);
        } else {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg mx-auto">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Ping Pong
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className={
                animation
                  ? "navbar-toggler-icon navbar-toggle-animation"
                  : "navbar-toggler-icon"
              }
              onClick={handleAnimationToggle}
            >
              <AiOutlineMenu />
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-lg-0">
              <li className="nav-item navItems">
                <NavLink className="nav-link active" aria-current="page" to="/">
                  🏠 Home
                </NavLink>
              </li>
              <li className="nav-item navItems">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/get-new-friends"
                >
                  🔎 get new friends
                </NavLink>
              </li>
            </ul>
            {!Auth.isUser ? (
              <div className="nav-item navItems">
                <NavLink className="nav-link" aria-current="page" to="/login">
                  🔐 start free
                </NavLink>
              </div>
            ) : null}
            {Auth.isUser ? (
              <div className="nav-item logout navItems" onClick={handleLogout}>
                👋🏻 logout
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  );
}
