import express from "express"
import { AddFund, addPackageByUser, addUser, capitalWithdraw, changePassword, changeTxnPassword, editProfile, userLogin, verifyUser, viewAllPackage, viewChilds, viewUserPackageDetails, viewUserProfile, walletWithdraw } from "../controller/userController.js"
import { protectUser } from "../middleware/authMiddleware.js"
import { capitalWithdrawReport, dailyROIReport, directIncomeReport, level1IncomeReport,level2IncomeReport,level3IncomeReport, walletWithdrawReport } from "../controller/reportController.js"


const router=express.Router()
router.put("/edit-profile",protectUser,editProfile)

router.post("/add-user",protectUser,addUser)
router.post("/user-login",userLogin)
router.post("/verify-user",protectUser,verifyUser)
router.post("/add-fund",protectUser,AddFund)
router.post("/change-password",protectUser,changePassword)
router.post("/change-tnx-password",protectUser,changeTxnPassword)
router.post("/add-package-by-user",protectUser,addPackageByUser)
router.post("/withdraw-capital",protectUser,capitalWithdraw)
router.post("/withdraw-wallet",protectUser,walletWithdraw)

router.get("/view-user-profile",protectUser,viewUserProfile)
router.get("/view-all-package",protectUser,viewAllPackage)
router.get("/view-childs",protectUser,viewChilds)
router.get("/view-user-package",protectUser,viewUserPackageDetails)
router.get("/view-direct-referal-history",protectUser,directIncomeReport)
router.get("/view-level1-Report",protectUser,level1IncomeReport)
router.get("/view-level2-Report",protectUser,level2IncomeReport)
router.get("/view-level3-Report",protectUser,level3IncomeReport)
router.get("/view-ROIIncome-Report",protectUser,dailyROIReport)
router.get("/wallet-Withdraw-Report",protectUser,walletWithdrawReport)
router.get("/capital-Withdraw-Report",protectUser,capitalWithdrawReport)



















export default router;