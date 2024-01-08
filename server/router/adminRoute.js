import express from "express"
import { protectUser } from "../middleware/authMiddleware.js"
import { acceptUser, addAdmin, addPackage, adminLogin, approveFundAdd, getApprovedUsers, getReadyToApproveUsers, rejectUser, userPackageApproval, userPackageReject, viewAddFundPending, viewAllUsers } from "../controller/adminController.js"
import { allUserCommissionSplit } from "../controller/commissionSplit.js"


const adminRouter=express.Router()

adminRouter.post("/add-admin",addAdmin)
adminRouter.post("/admin-login",adminLogin)
adminRouter.post("/add-package",protectUser,addPackage)
adminRouter.get("/view-all-users",protectUser,viewAllUsers)
adminRouter.get("/view-approved-users",protectUser,getApprovedUsers)
adminRouter.get("/view-ready-to-approved-users",protectUser,getReadyToApproveUsers)
adminRouter.post("/accept-users/:id",protectUser,acceptUser)
adminRouter.get("/reject-users",protectUser,rejectUser)
adminRouter.get("/view-addFund-pending",protectUser,viewAddFundPending)
adminRouter.post("/approve-addFund/:id",protectUser,approveFundAdd)
adminRouter.post("/user-package-approval/:id",protectUser,userPackageApproval)
adminRouter.post("/user-package-rejected/:id",protectUser,userPackageReject)

adminRouter.post("/commission-split",protectUser,allUserCommissionSplit)














export default adminRouter;