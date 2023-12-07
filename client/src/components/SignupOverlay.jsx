import React from "react";
import WaveLogo from "../assets/waveLogo.png";
import { MdError } from "react-icons/md";
import { useEffect } from "react";
const SignupOverlay = (props) => {



  return (
    <div
      className={`sign-up ${
        props.loginBoxDisplay === "login" ? "" : "overlay-opacity-full"
      }`}
    >
      <div className="mobile-logo-wrapper">
        <img src={WaveLogo} />
        <h3>Wave</h3>
      </div>
      <h3 className="sign-up-header">Sign up to continue</h3>
      <form autocomplete="off" onSubmit={(e)=>props.signUp(e)}>
        <div className="sign-up-name-form">
          <div className="sign-up-form-item">
            <label htmlFor="signup-name">First Name</label>
            <input
              className="signup-input"
              required
              type="text"
              id="signup-name"
              name="signup-name"
              placeholder="Enter your first name"
              value={props.firstName}
              onChange={(e)=>props.setFirstName(e.target.value)}
            />
          </div>
          <div className="sign-up-form-item">
            <label htmlFor="signup-lastname">Last Name</label>
            <input
              className="signup-input"
              required
              type="text"
              id="signup-lastname"
              name="signup-lastname"
              placeholder="Enter your last name"
              value = {props.lastName}
              onChange={(e)=>props.setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className={`sign-up-form-item`}>
          <label htmlFor="signup-email">Email</label>
          <input
            className={`signup-input ${props.error ? "signUp-form-error" : ""}`}
            required
            type="email"
            id="signup-email"
            name="signup-email"
            placeholder="Enter your email"
            autocomplete="new-password"
            value={props.email}
            onChange={(e)=>props.setEmail(e.target.value)}
          />
          
            <div  id="signUp-error">
              {props.error && (
                <div className="error-animation">
                <MdError color={"#ed4337"}/>
                <p className="signUp-error-msg">{props.error}</p>
                </div>
              )}

          </div>
          

        </div>
        <div className="sign-up-form-item">
          <label htmlFor="signup-pw">Password</label>
          <input
            className="signup-input"
            required
            type="password"
            id="signup-pw"
            name="signup-pw"
            placeholder="Enter your password"
            autocomplete="new-password"
            value={props.pw}
            onChange={(e)=>props.setPw(e.target.value)}
          />
        </div>
        <div className="sign-up-buttons">
          <p>
            Have an account?{" "}
            <span onClick={(e) => props.setLoginBoxDisplay("login")}>
              Sign In.
            </span>
          </p>
          <button>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignupOverlay;
