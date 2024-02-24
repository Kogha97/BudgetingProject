import React from 'react'
import { useState, useContext } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../Context/userContext'

export default function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { user , setUser} = useContext(UserContext)
  const toggleDropdown = () => {
    setDropdownVisible(dropdownVisible => !dropdownVisible);
  }
  const handleLogout = () => {
    localStorage.removeItem('bankUser'); 
    setUser({ isLoggedIn: false }); 
  };

  return (
    <header className='header'>
      <div className='header-left'>
      
      </div>
        <div className='header-mid'>
        {user.isLoggedIn && (
          
          <h3 className='userGreeting'>Hello, {user.firstName}!</h3>
      
        )}
      
        </div>
        <div className='header-right'>
        {user.isLoggedIn ? (
          <h3 className='loginText'>Logged In</h3>
        ) : (
          <h3 className='loginText'><NavLink to="/login">Login</NavLink></h3>
        )}
       <button onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faUser} className='userIcon'/><i className='fa fa-caret-down'></i></button>
        {dropdownVisible && (
          <div className={`profileDropdown ${dropdownVisible ? 'visible' : ''}`}>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/flow-out">Settings</NavLink>
            <a onClick={handleLogout}>Logout</a>
          </div>
        )}
        </div>
    </header>
  )
}
