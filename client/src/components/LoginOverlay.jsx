import React from "react";
import WaveLogo from "../assets/waveLogo.png";
import { MdError } from "react-icons/md";
const LoginOverlay = (props) => {
  return (
    <div
      className={`login ${
        props.loginBoxDisplay === "login" ? "" : "overlay-opacity-none"
      }`}
    >
      <div className="mobile-logo-wrapper">
        <img src={WaveLogo} />
        <h3>Wave</h3>
      </div>
      <h3 className="login-header">Log in</h3>
      <form autocomplete="off" onSubmit={(e) => props.logIn(e)}>
        <div className="login-form-item">
          <label htmlFor="login-email">Email</label>
          <input
            className="login-input"
            type="email"
            id="login-email"
            name="login-email"
            value={props.email}
            onChange={(e) => props.setEmail(e.target.value)}
            placeholder="Enter your email"
            autocomplete="new-password"
          />
        </div>
        <div className="login-form-item">
          <label htmlFor="login-pw">Password</label>
          <input
            className="login-input"
            type="password"
            id="login-pw"
            name="login-pw"
            value={props.pw}
            onChange={(e) => props.setPw(e.target.value)}
            placeholder="Enter your password"
            autocomplete="new-password"
          />
            <div id="login-error">
              {props.error && (
                <div className="error-animation">
                  <MdError color={"#ed4337"} />
                  <p className="signUp-error-msg">{props.error}</p>
                </div>
              )}

            </div>
        </div>
        <div className="login-buttons">
          <p>
            Dont have an account?{" "}
            <span onClick={(e) => props.setLoginBoxDisplay("signup")}>
              Sign Up.
            </span>
          </p>
          <button>Log In</button>
        </div>
      </form>
    </div>
  );
};

export default LoginOverlay;
