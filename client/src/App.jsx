import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import VerifiyEmail from './pages/VerifiyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import UpdatePassword from './pages/UpdatePassword'
import { ToastContainer } from 'react-toastify'
import { useState } from 'react'

function App() {
  
  const [user, setUser] = useState(null)

  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/admin' element={<Admin/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/verify-email' element={<VerifiyEmail/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
          <Route path='/update-password' element={<UpdatePassword/>} />
        </Routes>
        <ToastContainer position='top-right' autoClose={3000}/>
      </BrowserRouter>
    </>
  )
}

export default App
 