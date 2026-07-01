import express from "express"
import User from '../models/user.model.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

// ==========================================
// 5. ROUTE : ESPACE ADMIN (PROTÉGÉE + FILTRE ROLE)
// ==========================================

router.get('/admin', verifyToken, async (req, res) => {
    // 1. Le middleware verifyToken a fait son travail.
    // 2. On effectue ici un second contrôle (Autorisation) basé sur le rôle de l'utilisateur
    if (req.user.role !== 'admin') {
        // Si l'utilisateur n'est pas admin, on bloque l'accès avec un statut 403 (Forbidden)
        return res.status(403).json({message: 'Acces refusé'})
    }
    
    // Si c'est bien un admin, on récupère la liste complète de tous les utilisateurs en BDD
    const user = await User.find()
    return res.status(200).json(user)
})

export default router