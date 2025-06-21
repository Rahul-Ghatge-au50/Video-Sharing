const jwt = require('jsonwebtoken');
const User = require("../Models/User");

const authMiddleware = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({error:'No token provided'})
        };

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById({_id:decoded.id});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            });
        }

        req.user = user;
        next();
    }catch(error){
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

module.exports = authMiddleware;