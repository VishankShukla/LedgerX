const { compare } = require("bcrypt");
const userModel = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../Models/blackList.model");

async function userRegisterController(req, res){
    const {email, name, password} = req.body;

    const isExists = await userModel.findOne({
        email:email,
    });
    if(isExists){
        return res.status(422).json({
            message:"User Already Exists with this email",
            status:"Failed"
        })
    }

    const user = await userModel.create({
        email,name,password
    });

    const token = jwt.sign({user_ID:user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});

    res.cookie("token",token);

    res.status(201).json({
        user:{
            _id:user._id,
            email: user.email,
            name: user.name,
        }
    });

    await emailService.sendRegistrationEmail(user.email, user.name);
}

async function userLoginController(req, res) {
    const {email, password} = req.body;
    
    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({
            message:"Email or Password Invalid",
        })
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid){
        return res.status(401).json({
            message:"Email or Password Invalid",
        })
    }

    const token = jwt.sign({user_ID:user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});

    res.cookie("token",token);

    res.status(200).json({
        user:{
            _id:user._id,
            email: user.email,
            name: user.name,
        }
    })

}

async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(200).json({
            message:"User Logout Successfuly"
        })
    };

    res.clearCookie("token","");

    await tokenBlackListModel.create({
        token:token
    })

    return res.status(200).json({
        message:"User Logout Successfuly"
    })

}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}