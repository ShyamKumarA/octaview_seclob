import express from "express"
import { protectUser } from "../middleware/authMiddleware.js"
import { acceptUser, addAdmin, addPackage, adminLogin, approveCapitalwithdrawal, approveFundAdd, approveWalletWithdrawal, getApprovedUsers, getReadyToApproveUsers, rejectCapitalwithdrawal, rejectUser, rejectWalletWithdrawal, userPackageApproval, userPackageReject, viewAddFundPending, viewAddPackageFundPending, viewAllUsers, viewWalletWithdrawPending, viewWithdrawPending } from "../controller/adminController.js"
import { allUserCommissionSplit } from "../controller/commissionSplit.js"
import { directIncomeReport } from "../controller/reportController.js"


const adminRouter=express.Router()

adminRouter.post("/add-admin",addAdmin)
adminRouter.post("/admin-login",adminLogin)
adminRouter.post("/add-package",protectUser,addPackage)
adminRouter.post("/accept-users/:id",protectUser,acceptUser)
adminRouter.post("/approve-addFund/:id",protectUser,approveFundAdd)
adminRouter.post("/user-package-approval/:id",protectUser,userPackageApproval)
adminRouter.post("/user-package-rejected/:id",protectUser,userPackageReject)
adminRouter.post("/user-capitalWithdraw-approval/:id",protectUser,approveCapitalwithdrawal)
adminRouter.post("/user-capitalWithdraw-reject/:id",protectUser,rejectCapitalwithdrawal)
adminRouter.post("/user-walletWithdraw-approval/:id",protectUser,approveWalletWithdrawal)
adminRouter.post("/user-walletWithdraw-reject/:id",protectUser,rejectWalletWithdrawal)






adminRouter.get("/view-all-users",protectUser,viewAllUsers)
adminRouter.get("/view-approved-users",protectUser,getApprovedUsers)
adminRouter.get("/view-ready-to-approved-users",protectUser,getReadyToApproveUsers)
adminRouter.get("/view-addFund-pending",protectUser,viewAddFundPending)
adminRouter.get("/view-addPackageFund-pending",protectUser,viewAddPackageFundPending)
adminRouter.get("/reject-users",protectUser,rejectUser)
adminRouter.get("/view-withdraw-pending",protectUser,viewWithdrawPending)
adminRouter.get("/view-wallet-withdraw-pending",protectUser,viewWalletWithdrawPending)




adminRouter.post("/commission-split",protectUser,allUserCommissionSplit)














export default adminRouter;