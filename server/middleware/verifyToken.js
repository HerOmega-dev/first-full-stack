import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
    try {
        const authorization = req.headers.authorization //avec les cookies on passe pas par headers
        const token = authorization.split(' ')[1]
    
        // const token = req.cookie avec les cookies

        if (!token) {
            return res.status(401).json({message:'Token manquant'})
        }
        
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (e) {
        res.status(403).json({message:'Token invalide'})
    }
}
export default verifyToken