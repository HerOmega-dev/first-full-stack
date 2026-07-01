import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

import User from '../models/user.model.js'
import verifyToken from '../middleware/verifyToken.js'
import sendConfirmationEmail from '../middleware/sendConfirmationEmail.js'
import { upload } from '../middleware/storage.js'

const router = express.Router()

// On passe le middleware Multer 'upload.single('image')' pour intercepter et gérer le téléversement d'un fichier image unique nommé 'image'
router.post('/register', upload.single('image'), async(req, res) => {
    try {
        // Extraction des données textuelles envoyées dans le corps de la requête (formulaire)
        const {username, email, password, role} = req.body
        // 1. Vérifier si l'utilisateur existe déjà dans la base de données
        const user = await User.findOne({username})
        if (user) {
            return res.status(400).json({message:'Cet utilisateur existe déjà'})
        }
        
        // Permet de ne jamais stocker le mot de passe en clair dans la base de données
        const hash = await bcrypt.hash(password, 10)
        
        // Récupération des informations du fichier téléchargé via Multer (si présent)
        const imageFile = req.file
        // Si un fichier a été téléversé, on récupère son nom généré par Multer, sinon on attribue null
        const fileName = imageFile ? imageFile.filename : null

        // Génération d'un token unique et aléatoire de 32 octets converti en chaîne hexadécimale, utilisé pour la vérification de l'adresse e-mail
        const token = crypto.randomBytes(32).toString('hex')

        // 3. Créer et sauvegarder le nouvel utilisateur dans la base de données
        await User.create({username, email, password:hash, role, image: fileName, token})

        // 4. Construction de l'URL de vérification pointant vers le front-end, on y intègre le token unique en paramètre de requête (query param)
        const url = `http://localhost:5173/verify-email?token=${token}`
        // Appel de la fonction d'envoi de l'e-mail de confirmation
        sendConfirmationEmail(email, url)

        res.status(201).json({message:'Utilisateur crée'})

    } catch (err) {
        return res.status(500).json(err)
    }
})

router.get('/verify-email', async(req, res) => {
    try {
        // 1. Récupération du token depuis les paramètres de l'URL
        // const token = req.query.token
        const {token} = req.query //destructuration
        
        const user = await User.findOne({token})
        if (!user) {
            return res.status(400).json({message:"Bad request !"})
        } else {
            // On passe son statut à 'true' pour activer le compte
            user.isActive = true
            // On peut optionnellement vider le token pour qu'il ne soit plus réutilisable :
            // user.token = "" //A cause du await, il vide avant de chercher le user, quand il est en dehors du else
            // user.token = undefined
            await user.save()
            return res.json({message: 'Votre compte est activé'})
        }
    } catch (err) {
        return res.status(500).json({message:'Error verify-email', err})
    }
})

// router.post('/login-localstorage', async(req, res) => {
//     try {
//         const {email, password} = req.body
//         const user = await User.findOne({email})
//         if (!user) {
//             return res.status(400).json({message:'identifiants invalides'})
//         }
//         const isMatch = await bcrypt.compare(password, user.password)
//         if (!isMatch) {
//             return res.status(400).json({message:'identifiants invalides'})
//         }
//         const token = jwt.sign(
//             {id:user._id, email:user.email, role:user.role, image:user.image},
//             process.env.JWT_SECRET,
//             {expiresIn:'2h'})

//         res.status(200).json({token, message:'Vous êtes connectay'})
//     } catch (err) {
//         return res.status(500).json({message:err})
//     }
// })

router.post('/login-cookie', async(req, res) => {
    try {
        // Log de débogage pour voir les données brutes reçues par le serveur
        console.log(req.body)

        const {email, password} = req.body
        
        if (!email || !password) {
            return res.status(400).json({message: "Veuillez remplir tous les champs"})
        }
        
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: "Identifiants invalides"})
        }

        if (!user.isActive) {
            // Le statut 401 (Unauthorized) est idéal ici car l'utilisateur est reconnu mais pas autorisé à naviguer
            return res.status(401).json({message: 'Activez votre compte'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: "Identifiants invalides"})
        }

        // 3. Générer le JSON Web Token (JWT)
        // Le "payload" (1er argument) contient les données non sensibles de l'utilisateur incluses dans le token
        const token = jwt.sign(
            {id:user._id, username:user.username, role:user.role, image:user.image},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )
        //Variante
        //const userPayload = {id: user._id, email: user.email, role: user.role, image: user.image}*
        //const token = jwt.sign(userPayload, process.env.JWT_SECRET, {expiresIn: '1d})

        // 3. Configuration et création du Cookie sécurisé
        // Le cookie est nommé 'token' et reçoit la valeur du JWT
        res.cookie('token', token, {
            httpOnly: true, // Crucial : Empêche le JavaScript (et donc les failles XSS) d'accéder au cookie
            secure: process.env.NODE_ENV === 'production', // Le cookie ne transite qu'en HTTPS lorsqu'on est en production
            maxAge: 3600 * 1000 * 2, //ms
            sameSite: 'lax'  // Protège contre les attaques de type CSRF en restreignant l'envoi du cookie aux requêtes intersites sécurisées
        })

        // 4. Réponse au client (ex: React)
        // Le cookie est envoyé automatiquement dans les en-têtes HTTP (Headers).
        // On renvoie séparément les infos de l'utilisateur au format JSON pour que React puisse mettre à jour son état (Context/Redux)
        return res.status(200).json({
            message: "Connexion réussie",
            user: userPayload
        });

    } catch (err) {
        return res.status(500).json({message: err.message || err})
    }
})

// ==========================================
// 1. ROUTE : MOT DE PASSE OUBLIÉ
// ==========================================
router.post ('/forgot-password', async(req, res) => {
    try {

        const {email} = req.body
        const user = await User.findOne({email})
        if (!user) {
            // Note de sécurité : Idéalement, on retourne un statut 200 avec le même message pour éviter "l'énumération d'e-mails" 
            // (ne pas laisser savoir à un attaquant si un e-mail existe ou non dans votre base)
            return res.json({message: 'Compte introuvable'})
        }
        
        const token = crypto.randomBytes(32).toString('hex')
        user.token = token
        await user.save()

        const url = `htpp://localhost:5173/reset-password?token=${token}`
        sendConfirmationEmail(email, url)

        return res.status(200).json({message: "Un mail a été envoyé"})

    } catch (err) {
        return res.status(500).json({message:"Erreur", err})
    }
})

// ==========================================
// 2. ROUTE : RÉINITIALISATION DU MOT DE PASSE
// ==========================================
router.post('/reset-password', async(req, res) => {
    try {
        const {password} = req.body // Le nouveau mot de passe saisi par l'utilisateur
        const {token} = req.query

        const user = await User.findOne({token})
        if (!user) {
            return res.status(400).json({message:"Token invalide"})
        }

        user.password = await bcrypt.hash(password, 10)
        // TRÈS BONNE PRATIQUE : Décommentez la ligne suivante en production pour invalider le token.
        // Cela évite que le même lien de réinitialisation puisse être réutilisé plusieurs fois !
        // user.token = null
        await user.save()

        return res.status(200).json({message:"MDP réinitialisé"})

    } catch (err) {
        return res.status(500).json({message:err})
    }
})

// ==========================================
// 3. ROUTE : DÉCONNEXION (LOGOUT)
// ==========================================
router.post('/logout', (req, res) => {
    // Pour déconnecter l'utilisateur lorsqu'on utilise les cookies httpOnly, 
    // il suffit de renvoyer un cookie vide portant le même nom et expiré.
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Assigne la date du 1er janvier 1970 (le navigateur supprime immédiatement le cookie)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })
    res.status(200).json({ message: "Déconnecté !" })
})

// ==========================================
// 6. ROUTE : MODIFICATION DU MOT DE PASSE
// ==========================================
router.put('/update-password', verifyToken, async(req, res) => {
    try {
        const {oldPassword, newPassword} = req.body

        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(400).json({message: "/update-password user invalide"})
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({message: "/update-password password invalide"})
        }

        const hash = await bcrypt.hash(newPassword, 10)
        user.password = hash
        await user.save()

        return res.status(200).json({message: "Mot de passe modifié avec succès"})

    } catch (err) {
        return res.status(500).json({message: "/update-passsword Erreur server", err})
    }
})

export default router