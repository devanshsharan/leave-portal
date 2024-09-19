import React from 'react'
import './Css/Header.css';
import logo from './assets/beehyvlogo.png';

function Header() {
  return (
    <div className="parent">
    <div>
    <img src={logo} alt="Logo" />

    </div>
    <div>
        Hello
    </div>
    </div>
    
  )
}

export default Header;