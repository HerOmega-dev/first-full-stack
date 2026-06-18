import { useState } from 'react'
import './App.css'

function App() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    })
    const data = await response.json()
    localStorage.setItem('token', data.token)
    console.log(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
        <button>Connexion</button>

      </form>
    </>
  )
}

export default App
