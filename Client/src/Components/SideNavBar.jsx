import React, { useState } from 'react';
import {NavLink} from 'react-router-dom';
import '../index.css';
export default function SideNavBar() {

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
      setDropdownVisible(dropdownVisible => !dropdownVisible);
  
  };
  
  return (  
    <div className='SideNavBar'>
        <div className='closingButton'>
            <button className='x-button'>X</button>
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
  )
}
