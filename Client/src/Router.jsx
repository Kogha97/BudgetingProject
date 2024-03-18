import React from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideNavBar from './Components/SideNavBar';
import HomePage from './Pages/HomePage';
import CashIn from './Pages/CashIn';
import CashOut from './Pages/CashOut';
import Subs from './Pages/Subs';
import HouseExpenses from './Pages/HouseExpenses';
import Groceries from './Pages/Groceries';
import EatingOut from './Pages/EatingOut';
import Header from './Components/Header';
import Login from './Pages/Login'
import Register from './Pages/Register'
import UserProfile from './Pages/UserProfile';
import OpenButton from './Components/OpenButton';
import EmailConfirm from './Pages/EmailConfirm';
import ForgotPass from './Pages/ForgotPass';
import ChangePass from './Pages/ChangePass';
import Travel from './Pages/Travel';
import Medical from './Pages/Medical';
import Extras from './Pages/Extras'

export default function Router() {
  return (
    <BrowserRouter>
        <SideNavBar/>
      <div className='contentGrid'>
      <Header/>
      <OpenButton/>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/profile' element={<UserProfile/>}/>
            <Route path='/flow-in' element={<CashIn/>}/>
            <Route path='/flow-out' element={<CashOut/>}/>
            <Route path='/subs' element={<Subs/>}/> 
            <Route path='/house-expenses' element={<HouseExpenses/>}/>
            <Route path='/groceries' element={<Groceries/>}/>
            <Route path='/eating-out' element={<EatingOut/>}/>
            <Route path='/emailconfirm/:token' element={<EmailConfirm/>}/>      
            <Route path='/forgotPassword' element={<ForgotPass/>}/>      
            <Route path='/medical' element={<Medical/>}/>
            <Route path='/travel' element={<Travel/>}/>    
            <Route path='extras' element={<Extras/>}/>    
            <Route path='/changePass/:token' element={<ChangePass/>}/>    
          </Routes>
      </div>
    </BrowserRouter>
  )
}
