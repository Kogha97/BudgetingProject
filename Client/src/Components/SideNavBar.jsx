import React, { useState, useContext } from 'react';
import { UserContext } from '../Context/userContext';
import {NavLink} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../index.css';

export default function SideNavBar() {

    const [dropdownVisible, setDropdownVisible] = useState(false);
  
    const { user, setUser} = useContext(UserContext)

    const toggleDropdown = () => {
      setDropdownVisible(dropdownVisible => !dropdownVisible);
  
  };

  const handleCloseNavBar = () => {
    setUser({...user, navbar: false})
    localStorage.setItem("bankUser", JSON.stringify({ ...user,  navbar: false}));

  };

  
  library.add(faAngleLeft);

  if(!user.isLoggedIn || !user.navbar){
    return null
  }
  return user.navbar ? (
    <div className='SideNavBar'>
        <div className='closingButton'>
            <button onClick={handleCloseNavBar} ><FontAwesomeIcon icon="fa-solid fa-angle-left" className='x-button' /></button>
        </div>

        <div className='features'>
            <button onClick={toggleDropdown}>Cash Flow <i className='fa fa-caret-down'></i></button>
            {dropdownVisible && (
                <div className={`dropdownVisible ${dropdownVisible ? 'visible' : ''}`}>
                    <NavLink to="/flow-in">Flow In</NavLink>
                    <NavLink to="/flow-out">Flow Out</NavLink>
                    <NavLink to="/">Comparison</NavLink>
                </div>
            )}

            <NavLink to="/subs">Subscriptions</NavLink>
            <NavLink to="/house-expenses">House Expenses</NavLink>
            <NavLink to="/groceries">Groceries</NavLink>
            <NavLink to="/eating-out">Eating Out</NavLink>
        </div>
    </div>
) : null;
}