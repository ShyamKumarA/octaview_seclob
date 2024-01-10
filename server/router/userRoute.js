import express from "express"
import { AddFund, addPackageByUser, addUser, capitalWithdraw, changePassword, changeTxnPassword, editProfile, userLogin, verifyUser, viewAllPackage, viewChilds, viewUserPackageDetails, viewUserProfile, walletWithdraw } from "../controller/userController.js"
import { protectUser } from "../middleware/authMiddleware.js"


const router=express.Router()

router.post("/add-user",protectUser,addUser)
router.post("/user-login",userLogin)
router.post("/verify-user",protectUser,verifyUser)
router.get("/view-user-profile",protectUser,viewUserProfile)
router.put("/edit-profile",protectUser,editProfile)
router.get("/view-childs",protectUser,viewChilds)
router.get("/view-all-package",protectUser,viewAllPackage)
router.get("/view-user-package",protectUser,viewUserPackageDetails)
router.post("/add-fund",protectUser,AddFund)
router.post("/change-password",protectUser,changePassword)
router.post("/change-tnx-password",protectUser,changeTxnPassword)
router.post("/add-package-by-user",protectUser,addPackageByUser)
router.post("/withdraw-capital",protectUser,capitalWithdraw)
router.post("/withdraw-wallet",protectUser,walletWithdraw)













export default router;