const { Router } = require("express");
const userRouter = Router();
const { userModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config")

userRouter.post("/signup", async (req, res) => {
    const{ email, password, firstName, lastName} = req.body;

    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    await userModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName:lastName
    })

    res.json({
        message:"You are signed Up!"
    })
});

userRouter.post("/signin", async (req, res) => {
    const {email, password} = req.body;
    
    const user = await userModel.findOne({
        email: email
    })
    
    if(!user){
        res.json({
            message:"User not found"
        })
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if(passwordValid){
        const token = jwt.sign({
            id: user._id.toString()
        },JWT_USER_PASSWORD)
        res.json({
            token
        })
    } else{
        res.status(400).json({
            message:"Invalid User Credentials"
        })
    }
});

userRouter.get("/purchases", async (req, res) => {
    const userId = req.userId;
    const purchases = await 
    res.json({
        message:"Your courses are" + MyCourses
    })                                       
});

module.exports = {
    userRouter: userRouter
}