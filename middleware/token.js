const jwt = require("jsonwebtoken")

const SECRET = "MY_SECRET_KEY";

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS")
        return next()

    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) 
            return res.status(401).json({message: "Access token missing"})
            
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        next()
    } catch (e){
        return res.status(401).json({message: "Server error (token)"})
    }
}