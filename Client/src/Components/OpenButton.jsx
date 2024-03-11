import React from 'react'
import { useContext } from 'react'
import { UserContext} from '../Context/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default function OpenButton() {

const { user, toggleNavbarVisibility } = useContext(UserContext)

library.add(faAngleRight)

  return (
    <>
    {user.isLoggedIn && !user.navbar && (
        <button onClick={toggleNavbarVisibility} >
          <FontAwesomeIcon icon={["fas", "angle-right"]}className="open-navbar-button" /> 
        </button>
      )}
     </>
  )
}
