const jwt = require("jsonwebtoken")

const { jwtSecret } = require('../config/app');

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS")
        return next()

        const authHeader = req.get('Authorization')

        const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
    } catch (e){
        if (e instanceof jwt.JsonWebTokenError)
            return res.status(401).json({message: "Invalid token"});

        return res.status(401).json({message: "Server error (token)"});
    }

    next();
}