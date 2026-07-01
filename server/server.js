import express from 'express';
const server = express()

import dns from 'dns'
dns.setServers(["1.1.1.1"])

import dotenv from 'dotenv';
dotenv.config()

import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.route.js'
import adminRoute from './routes/admin.route.js'
import profileRoute from './routes/profile.route.js'

const PORT = process.env.PORT || 3000

server.use(express.json())
server.use(cors({
    origin: 'http://localhost:5173',
    credentials: true //important pour cookie
})) //penser a mettre le cors avant tout middleware qui doit communiquer
server.use(cookieParser())
server.use('/uploads', express.static('uploads'))
server.use('', authRoute) 
server.use('', adminRoute)
server.use('', profileRoute)

mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log('connexion établie')
    server.listen(PORT, ()=> {
        console.log(`server on sur ${PORT}`)
    })
})
.catch (err => {
    console.log('/server.js mongoose.connect', err)
})
