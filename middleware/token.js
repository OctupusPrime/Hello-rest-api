const jwt = require("jsonwebtoken")

const { secret } = require('../config/app').jwt;

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS")
        return next()

        const authHeader = req.get('Authorization')

        if (!authHeader)
            return res.status(401).json({ message: 'Token not provided' })

        const token = authHeader.replace('Bearer ', '');
        
    try {
        const decoded = jwt.verify(token, secret);
        if (decoded.type !== 'access') {
            return res.status(401).json({ message: 'Invalid token' })
        }

        req.user = decoded;
    } catch (e){
        if (e instanceof jwt.TokenExpiredError)
        return res.status(401).json({message: "Token expired"});

        if (e instanceof jwt.JsonWebTokenError)
            return res.status(401).json({message: "Invalid token"});

        return res.status(401).json({message: "Server error (token)"});
    }

    next();
}