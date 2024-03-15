import React from 'react';
import { useState,} from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';


export default function ForgotPass() {

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [error, setError] = useState('')
  const handleSend = async () => {
    const response = await axios.post("http://localhost:5001/users/forgotPass", {emailOrUsername})
    console.log("🚀 ~ handleSend ~ response:", response)

  }

  return (
    <div className='bigLoginContainer'>
      <div className='loginSeparator'>

      </div>
      <div className='loginContainer'>
        <h2>Forgot your Password ?</h2>
        <div className='usernameContainer'>
          <label>Email or Username</label>
          <input 
            type="text" 
            name="username"
            placeholder='Username'
            value={emailOrUsername}
            onChange={(e)=> setEmailOrUsername(e.target.value)}/>
        </div>
 
        <p className='ErrorHandling'>{error || ''}</p>
        <button className='loginButton'
          type='submit'
          onClick={handleSend}
        >
          Send
        </button>
        <div className='loginRegisterContainer'>
          <p>If you do not have an account, register <NavLink to='/register'>here.</NavLink></p>
        </div>
      </div>
    </div>
  );
}
