import React, { useContext } from 'react'
import { useState } from 'react'
import { NavLink, useNavigate} from 'react-router-dom'
import axios from 'axios'
import  { UserContext } from '../Context/userContext'

export default function Login() {

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('') 
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext)

  const handleLogin = async () => {

    const response = await axios.post('http://localhost:5001/users/login', {
      emailOrUsername,
      password
    });
    console.log("response from login: ", response)

    if(response.data.success) {
      localStorage.setItem("bankUser", JSON.stringify({ ...response.data.user, isLoggedIn: true }));
      setUser({ ...response.data.user, isLoggedIn: true });
      navigate("/");
  }
}

  return (
    <div className='bigLoginContainer'>
    <div className='loginContainer'>
      <h2>Login</h2>
      <div className='usernameContainer'>
        <label>Email or Username</label>
        <input 
        type="text" 
        name="username"
        placeholder='Username'
        value={emailOrUsername}
        onChange={(e)=> setEmailOrUsername(e.target.value)}/>
      </div>
      <div className='passwordContainer'>
        <label>Password</label>
        <input 
        type="password" 
        name="password"
        placeholder='Password'
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        />
      </div>
      <button className='loginButton'
      type='submit'
      onClick={handleLogin}
      >
        Login</button>
      <div className='loginRegisterContainer'>
        <p>If you do not have an account, register <NavLink to='/register'>here.</NavLink></p>
      </div>
    </div>
    </div>
  )
}
