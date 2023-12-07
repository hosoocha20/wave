import React from 'react'
import WaveLogo from "../assets/waveLogo.png";
import SurfSVG from "../assets/Water scooter-rafiki.svg";
const RightOverlay = (props) => {
  return (
    <div className={`right-overlay  ${props.loginBoxDisplay === 'login' ? "overlay-z-index-transition-in" : "overlay-index-change-behind "}`}>
      <div className='right-overlay__text-wrapper'>
          <div className="overlay-logo-wrapper">
            <img src={WaveLogo} />
            <h3>Wave</h3>
          </div>
          <div>
            <p>Its Time to ride the Wave.</p>
            <p>Let's dive back into productivity.</p>
          </div>
      </div>
      <img src={SurfSVG} id="surfSVG" />
      <p className="overlay-art-credit-right">Art by {' '}
        <a href="https://storyset.com/people">Storyset</a>
      </p>
    </div>
  )
}

export default RightOverlay