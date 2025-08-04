const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { courseModel } = require("../db"); 

const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
// const signupSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(6),
//     firstName: z.string().min(),
//     lastName: z.string().min()
// })

adminRouter.post("/signup", async (req, res) => {
    const {email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 5);

    console.log(hashedPassword);

    await adminModel.create({
        email: email,
        password: hashedPassword,
        lastName: lastName,
        firstName: firstName
    })

    res.json({
        message:"You're signed up"
    })
});

adminRouter.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const admin = await adminModel.findOne({
        email: email
    })

    if(!admin){
        res.json({
            message:"User does not exist"
        })
    } 
    const passwordCheck = await bcrypt.compare(password, admin.password);
    
    if(passwordCheck){
        const token = jwt.sign({
            id: admin._id.toString()
        }, JWT_ADMIN_PASSWORD);

        res.json({
            token
        })
    } else{
        res.status(403).status({
            message:"Invalid admin credentials" 
        })
    }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
    const adminId = req.userId;

    const {title, description, imageUrl, price} = req.body;

    const course = await courseModel.create({
        title:title,
        description: description,
        imageUrl:imageUrl,
        price:price,
        creatorId: adminId
    })

    res.json({
        message:"course created",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async (req, res) => {
    const adminId = req.userId;

    const {title, description, imageUrl, price, courseId} = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
        title:title,
        description: description,
        imageUrl:imageUrl,
        price:price,
    })

    res.json({
        message:"Course Updated",
        courseId: course._id
    })
})

adminRouter.get("/course", async (req, res) => {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId
    },{
        title:title,
        description: description,
        imageUrl:imageUrl,
        price:price,
    })

    res.json({
        message:"Course Updated",
    })
})

module.exports = {
    adminRouter: adminRouter
}