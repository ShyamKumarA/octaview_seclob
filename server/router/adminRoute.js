import express from "express"
import { protectUser } from "../middleware/authMiddleware.js"
import { addAdmin, addPackage, adminLogin } from "../controller/adminController.js"

const adminRouter=express.Router()

adminRouter.post("/add-admin",addAdmin)
adminRouter.post("/admin-login",adminLogin)
adminRouter.post("/add-package",protectUser,addPackage)


export default adminRouter;