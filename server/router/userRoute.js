import express from "express"
import { addUser, editProfile, userLogin, verifyUser, viewChilds } from "../controller/userController.js"
import { protectUser } from "../middleware/authMiddleware.js"

const router=express.Router()

router.post("/add-user",protectUser,addUser)
router.post("/user-login",userLogin)
router.post("/verify-user",protectUser,verifyUser)
router.post("/edit-profile",protectUser,editProfile)
router.get("/view-childs",protectUser,viewChilds)




export default router;