import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../Context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useTheme } from '../Context/ThemeContext';

export default function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); 
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user , setUser} = useContext(UserContext)
  const { dark, toggleDark, setTheme } = useTheme()


  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  }
  const handleLogout = async () => {

    const response = await axios.get(`http://localhost:5001/users/logout`,{
      withCredentials: true
    })

    if (response.data.success) {
      localStorage.removeItem('bankUser'); 
      setUser({ isLoggedIn: false, navbar: false});
      setTheme(false); // Explicitly set the theme to light on logout
      toggleDropdown();
    }
    navigate('/')
  };
useEffect(()=>{
  const tick = () =>{
    setCurrentDate(new Date());
  };

  const intervalId = setInterval(tick, 1000);

  return () => {
    clearInterval(intervalId)
  }
},[])

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };
  if (dropdownVisible) {
    document.addEventListener('mousedown', handleClickOutside);
  }
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
},[dropdownVisible])

const dateString = currentDate.toLocaleString('en-UK', {
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
});

const timeString = currentDate.toLocaleTimeString('en-UK',{
  hour: 'numeric', 
  minute: 'numeric', 
  second: 'numeric', 
  hour12: true, 
})

if(!user.isLoggedIn){
  return null
}
  return (
    <header className='header'>
      <div className='header-left'>
      <p>{dateString}</p>
      <p>{timeString}</p>
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
          <div ref={dropdownRef} className={`profileDropdown ${dropdownVisible ? 'visible' : ''}`}>
            <NavLink to="/profile">Profile</NavLink>
            <a onClick={toggleDark} className="theme-toggle-button"> {dark ? 'Light Theme ' : 'Dark Theme '}
          <FontAwesomeIcon icon={dark ? faSun : faMoon} />
            </a> 
            <a onClick={handleLogout}>Logout</a>
          </div>
        )}
        </div>
    </header>
  )
}
