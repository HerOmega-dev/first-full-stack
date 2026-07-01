import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';


export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/login-cookie', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password}),
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error('forbidden')
      }

      const data = await response.json()
      console.log(data)
      localStorage.setItem('role', data.role)
      localStorage.setItem('image', data.image)

      toast.success(data.message)

      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/profile')
      }

    } catch (err) {
      console.error("Erreur de connexion", err)
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
        <div style={{position: 'relative', display:'flex'}}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder='Password' 
            onChange={(e) => setPassword(e.target.value)}
            style={{width: '100%'}}
            />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}  
            style={{position: 'absolute', right: '0', cursor:'pointer'}}
            >{showPassword ? <FaRegEyeSlash /> : <FaRegEye />}</button>
        </div>
        <button>Connexion</button>
        <Link to='/register'>Inscription</Link>
        <Link to='/forgot-password'>Mot de passe oublié</Link>
      </form>
      <ToastContainer />
    </main>
  )
}
