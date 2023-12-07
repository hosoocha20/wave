import React from 'react'
import waveLogo from '../assets/waveLogo.png';
import userIcon from '../assets/userIcon-test40.png';
import {IoIosArrowDown } from "react-icons/io";


const Navbar = () => {
    
  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <div className='navbar-logo'>
          <img src={waveLogo} alt='Wave Logo' id='waveLogo'/>
          <h1>Wave</h1>
        </div>
        <button className='navbar-create-btn'>
          Create
        </button>
      </div>
      <div className='navbar-right'>
        <div className='navbar-userProfile'>
          <p>John Doe</p>
          <img src={userIcon} alt='User Profile Icone' id='userProfleIcon'/>
          <IoIosArrowDown className='userProfile-dropdown-icon'/>
        </div>
      </div>

    </nav>
  )
}

export default Navbar