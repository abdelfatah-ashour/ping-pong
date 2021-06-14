import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../API";
import { InputForm } from "../components/InputForm";
import { AuthContext } from "../Context/Auth";

export default function Login(props) {
  let history = useHistory();
  const { setAuth } = useContext(AuthContext);

  // set initial state values of form
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // handle change in any input
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    document.title = "Login";
  }, []);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // set login
    await API.post("/api/auth/login", user)
      .then((resp) => {
        setAuth({
          isUser: true,
        });
        const { _id, username, email } = resp.data.message;
        Cookies.set(
          "Info",
          {
            _id,
            username,
            email,
          },
          { secure: true, sameSite: "none", expires: 1, path: "/" }
        );
        Cookies.set("authorization", resp.headers.authorization, {
          secure: true,
          sameSite: "none",
          expires: 1,
          path: "/",
        });

        // if success display toaster friendly show success message
        toast.success("🦄 Welcome " + resp.data.message.username, {
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
        console.log(resp);
      })
      .catch((error) => {
        // if there any error display toaster friendly show Error message
        if (error.response) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          alert(error.message);
          console.log(error);
        }
      });
  };
  const InputFields = [
    {
      type: "email",
      label: "Email Address",
      id: "emailInput",
      name: "email",
      value: user.email,
      handleInput: handleChange,
    },
    {
      type: "password",
      label: "Password",
      id: "passwordInput",
      name: "password",
      value: user.password,
      handleInput: handleChange,
    },
  ];
  useEffect(() => {
    document.title = "Login";
    return () => {
      return;
    };
  }, []);

  return (
    <div
      className="column my-4 d-flex justify-content-center align-items-center"
      style={{ height: "calc(100vh - 140px)" }}
    >
      <div className="col-6 mx-auto">
        {InputFields.map((props, i) => {
          return (
            <React.Fragment key={i}>
              <InputForm {...props} />
            </React.Fragment>
          );
        })}
        <button
          className="btn"
          style={{ backgroundColor: "#f1f1f1" }}
          onClick={handleSubmit}
        >
          Login
        </button>
        don't have account ?{" "}
        <Link
          to="/register"
          style={{
            color: "#fff",
            fontSize: "1rem",
            textDecoration: "underline",
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
}
