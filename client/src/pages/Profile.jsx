import React from 'react'
import { Link } from 'react-router-dom'

export default function Profile() {
  return (
    <div>
      <Link to='/update-password' >Modifier le MDP</Link>
    </div>
  )
}
