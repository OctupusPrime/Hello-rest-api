const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");//HashPassword
const jwt = require("jsonwebtoken");//Access token

const User = mongoose.model("User");//Model of User

const { jwtSecret } = require('../../config/app');

class authController {
    async register (req, res) {
        try {
            const {email, password} = req.body;
            const candidate = await User.findOne({email});
    
            if (candidate)
                return res.status(404).json({message: `User ${ email } already exist`});
    
            const hashPassword = await bcrypt.hash(password, 8);

            const thisUser = new User({email, password: hashPassword});
            await thisUser.save();

            return res.json({message: "User was created"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Server error"});
        }         
    }

    async login (req, res) {
        try {
            const {email, password} = req.body;
    
            const thisUser = await User.findOne({email});
            if (!thisUser) 
                return res.status(404).json({message: `User ${ email } not found`});
    
            const isPassValid = bcrypt.compareSync(password, thisUser.password);
            if (!isPassValid)
                return res.status(400).json({message: "Invalid password"});

            const token = jwt.sign({id: thisUser.id}, jwtSecret);
            return res.json({token});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Server error"});
        } 
    }

    async user (req, res) {
        try {
            const user_id = req.user.id;
            
            const thisUser = await User.findOne({'_id': user_id});

            return res.json({email: thisUser.email});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Server error"});
        }         
    }
}

module.exports = new authController();