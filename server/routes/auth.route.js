import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/register', async(req, res) => {
    try {
        const {username, email, password} = req.body
        const user = await User.findOne({email})
        if (user) {
            return res.status(400).json({message:'Cet utilisateur existe déjà'})
        }

        const hash = await bcrypt.hash(password, 10)
        // const newUser = {
        //     username: username,
        //     email: email,
        //     password: hash
        // }
        // await User.create(newUser)

        await User.create({username, email, password:hash})
        res.status(201).json({message:'Utilisateur crée'})
    } catch (err) {
        res.status(500).json({message:err})
    }
})

router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message:'identifiants invalides'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message:'identifiants invalides'})
        }
        const token = jwt.sign(
            {id:user._id, email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:'2h'})

        res.status(200).json({token, message:'Vous êtes connectay'})
    } catch (err) {
        res.status(500).json({message:err})
    }
})

// router.get('/dashboard', verifyToken, async(req, res) => {
//     res.json({message:'Welcome aboard captain'})
// })

router.get('/protected', verifyToken, async (req, res) => {
    res.status(200).json({message:'Vous êtes dans une route protégée'})
})

export default router