const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");//HashPassword
const jwt = require("jsonwebtoken");//Access token
const authHelper = require('../../helpers/authHelper')

const User = mongoose.model("User");//Model of User
const Token = mongoose.model('Token');

const { secret } = require('../../config/app').jwt;

const updateTokens = async (userId) => {
    console.log(userId)
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    await authHelper.replaceDbRefreshToken(refreshToken.id, userId);

    return {
            accessToken,
            refreshToken: refreshToken.token
    };
};

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

            updateTokens(thisUser._id).then(tokens => res.json(tokens));
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Server error"});
        } 
    }

    async user (req, res) {
        try {
            const user_id = req.user.userId;
            
            const thisUser = await User.findOne({'_id': user_id});

            return res.json({email: thisUser.email});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Server error"});
        }         
    }

    refreshToken (req, res) {
        const { refreshToken } = req.body;
        let payload;
        try {
            payload = jwt.verify(refreshToken, secret);
            if (payloda.type !== 'refresh') {
                return res.status(400).json({message: "Invalid token"});
            }
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError)
                return res.status(401).json({message: "Invalid expired"});

            if (e instanceof jwt.JsonWebTokenError)
                return res.status(401).json({message: "Invalid token"});
        }

        Token.findOne({ tokenId: payload.id })
            .exec()
            .then((token) => {
                if (token === null)
                    throw new Error('Invalid token!');

                return updateTokens(token.userId);
            })
            .then(tokens => res.json(tokens))
            .catch(e => res.status(400).json({message: e.message}));
    }
}

module.exports = new authController();