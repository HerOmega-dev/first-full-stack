import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  async function logout() {
    try {
      const response = await fetch('http://localhost:3000/logout', {
				method: 'POST',
				credentials: "include"
			});
      
      if (response.ok) {
        localStorage.clear();
				setUser(null); // Changement immédiat de l'affichage ! useState in app.jsx
				navigate('/login');
			}
    } catch (err) {
      console.error("Erreur déconnexion :", error);
    }
  }

  return (
    <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px'}}>
      <div style={{display:'flex', gap:'16px'}}>
        <Link to='/'>Accueil</Link>
        <Link to='/login'>Connexion</Link>
        <Link to='/register'>Inscription</Link>
        <Link to='/admin'>Admin</Link>
        {/* <Link to='/profile'>Profile</Link> */}
      </div>
      <button onClick={logout}>Deconnexion</button>
    </nav>
  )
}
