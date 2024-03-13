import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, NavLink} from 'react-router-dom';


export default function Register() {

 const [username, setUsername] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] =useState('');
 const [firstName, setFirstName] = useState('')
 const [lastName, setLastName] = useState('')
 const [phoneNumber, setPhoneNumber] = useState('')
 const [error, setError] = useState('')

 const errorTimeoutRef = useRef(null)

 const navigate = useNavigate();

 const handleRegister = async () => {
  if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      if(errorTimeoutRef.current){
        clearTimeout(errorTimeoutRef.current)
      }
      errorTimeoutRef.current = setTimeout(()=>{
        setError('');

        errorTimeoutRef.current = null;
      }, 4000)
      return;
  }
  if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      if(errorTimeoutRef.current){
        clearTimeout(errorTimeoutRef.current)
      }
      errorTimeoutRef.current = setTimeout(()=>{
        setError('');

        errorTimeoutRef.current = null;
      }, 4000)
      return;
  }
  try {
      const response = await axios.post("http://localhost:5001/users/register",{
        withCredentials: true
      }, {
          username,
          email,
          password,
          firstName,
          lastName,
          phoneNumber,

      });

      if(response.data.success) {
          navigate("/login");
      } else {
 
          setError(response.data.message || 'Registration failed');
          if(errorTimeoutRef.current){
            clearTimeout(errorTimeoutRef.current)
          }
          errorTimeoutRef.current = setTimeout(()=>{
            setError('');
  
            errorTimeoutRef.current = null;
          }, 4000)
      }
  } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again later.');
      if(errorTimeoutRef.current){
        clearTimeout(errorTimeoutRef.current)
      }
      errorTimeoutRef.current = setTimeout(()=>{
        setError('');

        errorTimeoutRef.current = null;
      }, 4000)
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
    <div className='bigRegisterContainer'>
      <div className='registerSeparator'>

      </div>
    <div className='registerContainer'>
      <h2>Register</h2>
      <div className='usernameContainer'>
        <label>Username</label>
        <input 
        type="text" 
        name="username"
        placeholder='JohnDoeDev'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='nameContainer'>
        <div className='nameContainer-1'>
        <label>First Name</label>
        <input 
        type="text" 
        name="first name"
        placeholder='John'
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className='nameContainer-1'>
        <label>Last Name</label>
        <input 
        type="text" 
        name="last name"
        placeholder='Doe'
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      </div>
      <div className='phoneContainer'>
        <label>Phone Number</label>
        <input 
        type="text"
        name="phone number"
        placeholder='+44 0123456789' 
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className='emailContainer'>
        <label>Email</label>
        <input 
        type="text"
        name="email"
        placeholder='john.doe@dev.com' 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='passwordContainer'>
        <label>Password</label>
        <input 
        type="password" 
        name="password"
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <p className='ErrorHandling'>{error || ''}</p>
      <button 
        className='registerButton'
        type='submit'
        onClick={handleRegister}>Register</button>
      <div className='loginRegisterContainer'>
      <p>If you already have an account, Login <NavLink to='/login'>here.</NavLink></p>
      </div>
    </div>
    </div>
  )
}
