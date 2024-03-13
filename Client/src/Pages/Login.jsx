import React, { useContext, useRef } from 'react';
import { useState, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Context/userContext';

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const errorTimeoutRef = useRef(null)

  const handleLogin = async () => {
    try {

      const response = await axios.post('http://localhost:5001/users/login', {
        emailOrUsername,
        password,
      },{ withCredentials: true});
      
      console.log("response from login: ", response);

      if (response.data.success) {
        localStorage.setItem("bankUser", JSON.stringify({ ...response.data.user, isLoggedIn: true, navbar: true }));
        setUser({ ...response.data.user, isLoggedIn: true, navbar: true });
        navigate("/");
      } else {

        setError(response.data.message); 

        if(errorTimeoutRef.current){
          clearTimeout(errorTimeoutRef.current)
        }
        errorTimeoutRef.current = setTimeout(()=>{
          setError('');

          errorTimeoutRef.current = null;
        }, 4000)
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again later.');
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setError('');
        errorTimeoutRef.current = null;
      }, 4000);
    }
  };

  useEffect(() => {
    return () => {

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);
  return (
    <div className='bigLoginContainer'>
      <div className='loginSeparator'>

      </div>
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
        <p className='ErrorHandling'>{error || ''}</p>
        <button className='loginButton'
          type='submit'
          onClick={handleLogin}
        >
          Login
        </button>
        <div className='loginRegisterContainer'>
          <p>If you do not have an account, register <NavLink to='/register'>here.</NavLink></p>
        </div>
      </div>
    </div>
  );
}
