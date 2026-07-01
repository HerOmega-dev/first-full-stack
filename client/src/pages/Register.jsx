import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [image, setImage] = useState(null)
    const navigate = useNavigate()

    async function register(e) {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('role', role)
            formData.append('image', image)

            const response = await fetch ('http://localhost:3000/register', {
                method: 'POST',
                // Seulement en localstorage, not needed avec les cookies
                // headers: {
                //     'Content-Type':'application/json'
                // },
                // body: JSON.stringify({username, email, password, role})
                body: formData,
                credentials: "include"
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.message)
            }

            console.log(data.message)
            // navigate('/login')

        } catch (err) {
            console.error(err)
        }
    }

  return (
    <main>
        <form onSubmit={register}>
            <input type="text" placeholder='Username...' onChange={(e)=> setUsername(e.target.value)} required/>
            <input type="email" placeholder='Email...' onChange={(e)=> setEmail(e.target.value)} required/>
            <input type="password" placeholder='Password...' onChange={(e)=> setPassword(e.target.value)} required/>
            <select name="role" id='role' onChange={(e)=> setRole(e.target.value)} required>
                <option defaultValue={"choisir un rôle"}>Choisir un rôle</option>
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
            </select>
            <input type="file" accept='image/*' onChange={(e) => setImage(e.target.files[0])}/>
            <button>S'inscrire</button>
            <Link to='/login'>Se connecter</Link>
        </form>
    </main>
  )
}
