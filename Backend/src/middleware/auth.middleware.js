const userModel = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../Models/blackList.model");

async function authMiddleware(req, res, next){ 
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized Access, Missing Token"
        })
    };

    const isTokenBlackListed = await tokenBlackListModel.findOne({token});

    if(isTokenBlackListed){
        return res.status(401).json({
            message:"Unauthorized Access,token is invalid"
        })
    }

    try{
        const decoded = await jwt.verify(token , process.env.JWT_SECRET );

        const user = await userModel.findById(decoded.user_ID);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized Access, User Not Found"
            });
        }

        req.user = user;

        return next();

    }catch(err){
        return res.status(401).json({
            message:"Unauthorized Access, Invalid Token"
        })
    }
}

async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if(!token){
        return res.status(401).json({
            message:"Unauthorized User. Missing Token"
        })
    };

    const isTokenBlackListed = await tokenBlackListModel.findOne({token});

    if(isTokenBlackListed){
        return res.status(401).json({
            message:"Unauthorized Access,token is invalid"
        })
    }

    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.user_ID).select("+systemUser");

        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden Access, not a system user"
            })
        }

        req.user = user;

        return next();
    } catch(err) {
        return res.status(401).json({
            message:"Unauthorized User, Invalid token"
        })
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}