const { Router } = require("express");
const courseRouter = Router();
const { courseModel } = require("../db");
const { purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");


courseRouter.post("purchase",userMiddleware, async (req, res) =>{
    const userId = req.userId;
    const courseId = req.body.courseId;
    await purchaseModel.create({ 
        userId,
        courseId
    })
    res.json({
        message:"you have successfully bought the course"
    })
})

courseRouter.get("/preview", async (req, res) => {

    const courses = await courseModel.find({})
    res.json({
        courses
    })
});

module.exports = {
    courseRouter: courseRouter
}