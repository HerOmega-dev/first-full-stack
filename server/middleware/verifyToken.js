import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
    try {
        // const authorization = req.headers.authorization //avec les cookies on passe pas par headers
        // const token = authorization.split(' ')[1]
    
        const verifyToken = req.cookies.token //avec les cookies
        if (!verifyToken) {
            return res.status(403).json({message:'Token manquant'})
        }
        console.log('token = ', verifyToken)
        const decode = jwt.verify(verifyToken, process.env.JWT_SECRET)
        req.user = decode
        console.log('decode = ', decode)
        next()
    } catch (err) {
        res.status(500).json({message:'Token invalide', err})
    }
}
export default verifyToken