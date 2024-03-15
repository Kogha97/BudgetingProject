import React from 'react';
import { useState,} from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


export default function ChangePass() {

    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { token } = useParams()


    const handleSend = async () => {
        const response = await axios.post("http://localhost:5001/users/changePass", {password, token })

    console.log("🚀 ~ handleSend ~ response:", response)

    if (response.data.success) {
        setError(
          "Password changed successfully. In few seconds you will be redirected to the login page"
        );
    
        setTimeout(() => navigate("/login"), 5000); 
      }
    };



  return (
    <div className='bigLoginContainer'>
      <div className='loginSeparator'>

      </div>
      <div className='loginContainer'>
        <h2>You can now change your password</h2>
        <div className='usernameContainer'>
          <label>New Password</label>
          <input 
            type="password" 
            name="Password"
            placeholder='Password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}/>
        </div>
 
        <p className='ErrorHandling'>{error || ''}</p>
        <button className='loginButton'
          type='submit'
          onClick={handleSend}
        >
          Save
        </button>
        <div className='loginRegisterContainer'>
          <p>If you do not have an account, register <NavLink to='/register'>here.</NavLink></p>
        </div>
      </div>
    </div>
  );
};
