import express from 'express';
const server = express()

import dotenv from 'dotenv';
dotenv.config()

import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.route.js'

const PORT = process.env.PORT || 3000

server.use(express.json())
// server.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }))
server.use(cors())
server.use('', authRoute) //penser a mettre le cors avant le authRoute

mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log('connexion établie')
    server.listen(PORT, ()=> {
        console.log('server on')
    })
})
.catch (err => {
    console.log(err)
})
