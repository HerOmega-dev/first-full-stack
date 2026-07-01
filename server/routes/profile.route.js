import express from "express"
import User from "../models/user.model.js"
import verifyToken from "../middleware/verifyToken.js"

const router = express.Router()

// ==========================================
// 4. ROUTE : RÉCUPÉRATION DU PROFIL (PROTÉGÉE)
// ==========================================
// Le middleware 'verifyToken' extrait le JWT du cookie, le valide, et injecte les infos dans 'req.user'
router.get('/profile', verifyToken, (req, res) => {
    try {
        // 'req.user' contient le payload du JWT (id, email, role, image...) défini lors du login
        const user = req.user
        console.log(user)

        // On renvoie les infos au client pour qu'il puisse afficher le profil de l'utilisateur connecté
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({ message: "Erreur lors de la récupération du profil", err })
    }
})

export default router