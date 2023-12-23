import express from "express"
import { addUser, userLogin, verifyUser } from "../controller/userController.js"
import { protectUser } from "../middleware/authMiddleware.js"

const router=express.Router()

router.post("/add-user",protectUser,addUser)
router.post("/user-login",userLogin)
router.post("/verify-user",protectUser,verifyUser)


export default router;