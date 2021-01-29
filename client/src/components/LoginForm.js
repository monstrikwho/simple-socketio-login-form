import React, { useEffect, useState, useRef } from "react";
import isNumber from "is-number";
import "../styles/LoginForm.sass";

import io from "socket.io-client";
const socket = io.connect();

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [passStatus, setPassStatus] = useState(false);
  const passInput = useRef(null);

  useEffect(
    function () {
      // We accept a response from the server to enter the login
      socket.on("CHOOSE_UID_FROM_SERVER", ({ status }) => {
        setLoginStatus(status);
        if (!status) outErrorMessage("This user does not exist.");
      });

      // We accept a response from the server to enter the pass
      socket.on("CHOOSE_PASS_FROM_SERVER", ({ status }) => {
        setPassStatus(status);
        if (!status) outErrorMessage("This pass does not exist.");
        if (status) outErrorMessage("SUCCES");
      });

      // We focus on the password input
      if (passInput.current) passInput.current.focus();
    },
    [loginStatus]
  );

  const changeLoginValue = (e) => {
    const value = e.target.value;
    const input = document.querySelector("#login");

    // Change value to input
    setLogin(value);

    // Toggle status on change value of input
    if (value.length > 0) {
      input.setAttribute("class", "used");
    } else {
      input.removeAttribute("class");
    }
  };

  const changePasswordValue = (e) => {
    const value = e.target.value;
    const input = document.querySelector("#password");

    // Change value to input
    if (value.length < 5) setPassword(value);

    // We send the password to the server as soon as we enter 4 digits
    if (value.length === 4) sendPass(value);

    // Toggle status on change value of input
    if (value.length > 0) {
      input.setAttribute("class", "used");
    } else {
      input.removeAttribute("class");
    }
  };

  const sendLogin = () => {
    const statusValidation = validationLogin();
    if (!statusValidation) return outErrorMessage(statusValidation);
    socket.emit("CHOOSE_UID_FROM_CLIENT", { uid: login });
  };

  const sendPass = (pass) => {
    const statusValidation = validationPass();
    if (!statusValidation) return outErrorMessage(statusValidation);
    socket.emit("CHOOSE_PASS_FROM_CLIENT", { pass });
  };

  const validationPass = () => {
    if (password.length !== 4) return "Please, enter a key";
    if (!isNumber(password)) return "Please, write only number.";
    return true;
  };

  const validationLogin = () => {
    if (login.length < 1) return "UID is empty.";
    if (!isNumber(login)) return "Please, write only number.";
    return true;
  };

  const outErrorMessage = (status) => {
    if (status !== true) {
      document.querySelector(".message").textContent = status;
      setTimeout(() => {
        document.querySelector(".message").textContent = "";
      }, 2000);
      return;
    }
  };

  return (
    <form>
      {!loginStatus ? (
        <React.Fragment>
          <div className="group">
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => {
                changeLoginValue(e);
              }}
              autoFocus
            />
            <span className="bar"></span>
            <label>UID</label>
          </div>
          <button
            type="button"
            className="button buttonBlue"
            onClick={sendLogin}
          >
            Login
          </button>
        </React.Fragment>
      ) : (
        <div className="group">
          <input
            id="password"
            type="text"
            value={password}
            onChange={(e) => {
              changePasswordValue(e);
            }}
            ref={passInput}
          />
          <span className="bar"></span>
          <label>Key</label>
        </div>
      )}
      <div className="message"></div>
    </form>
  );
}
