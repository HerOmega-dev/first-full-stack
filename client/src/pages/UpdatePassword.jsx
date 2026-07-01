import React, { useState } from 'react'

export default function UpdatePassword() {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    async function updatePasswordSubmit(e) {
        e.preventDefault()
        try {

            const response = await fetch('http://localhost:3000/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({oldPassword, newPassword}),
                'credentials': 'include'
            })
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour')
            }
            const data = await response.json()
            console.log(data)
        } catch (err) {
            console.log('UpdatePassword.jsx', err)
        }
    }

  return (
    <form onSubmit={updatePasswordSubmit}>
        <input type="password" placeholder='Mot de passe actuel' onChange={(e) => setOldPassword(e.target.value)}/>
        <input type="password" placeholder='Nouveau mot de passe' onChange={(e) => setNewPassword(e.target.value)}/>
        <button>Envoyer</button>
    </form>
  )
}
