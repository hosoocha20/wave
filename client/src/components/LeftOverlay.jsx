import React from "react";
import WaveLogo from "../assets/waveLogo.png";
import SurfSVG from "../assets/Surfer-rafiki.svg";

const LeftOverlay = (props) => {
  return (
    <div className={`left-overlay ${props.loginBoxDisplay === 'signup' ? "overlay-index-change-front" : "overlay-z-index-transition-out"}`}>
      <div className="left-overlay__text-wrapper">
          <div className="overlay-logo-wrapper">
            <img src={WaveLogo} />
            <h3>Wave</h3>
          </div>
          <div>
            <p>Your Gateway to Effortless Productivity!</p>
            <p>Get Ready to Surf Through Your Tasks.</p>
          </div>
      </div>
      <img src={SurfSVG} id="surfingSVG" />
      <p className="overlay-art-credit-left">Art by {' '}
        <a href="https://storyset.com/sport">Storyset</a>
      </p>
      
    </div>
  );
};

export default LeftOverlay;
