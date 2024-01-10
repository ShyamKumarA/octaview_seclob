import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler.js";
import Package from "../models/packageModel.js";
import { findPackage, generateRandomString, generateReferalIncome } from "./userController.js";

//add admin Api

export const addAdmin = async (req, res, next) => {
  const { password, username, email, address, phone, isSuperAdmin } = req.body;
  try {
    const adminData = await User.findOne({ email: email });
    console.log(adminData);
    const ownSponserId = generateRandomString();
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      password: hashedPassword,
      username,
      email,
      address,
      ownSponserId,
      isSuperAdmin,
      phone,
    });
    if (!adminData) {
      const user = await newUser.save();
      res.status(201).json(user);
    } else {
      return next(errorHandler("User not found"));
    }
  } catch (error) {
    next(error);
  }
};

// admin login Api

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validAdmin = await User.findOne({ email });
    if (!validAdmin) {
      return next(errorHandler(401, "User not found"));
    }
    if (validAdmin.isSuperAdmin) {
      const validPassword = bcryptjs.compareSync(password, validAdmin.password);
      if (!validPassword) {
        return next(errorHandler(401, "Wrong credentials"));
      }
      const token = jwt.sign(
        { userId: validAdmin._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d",
        }
      );

      res.status(200).json({
        id: validAdmin._id,
        firstName: validAdmin.username,
        email: validAdmin.email,
        token_type: "Bearer",
        access_token: token,
        sts: "01",
        msg: "Admin Login Success",
      });
    } else {
      return next(errorHandler(401, "it is Not Admin"));
    }
  } catch (error) {
    next(error);
  }
};


//Add package API

export const addPackage = async (req, res, next) => {
  const adminId = req.user._id;
  const adminData = await User.findById(adminId);
  try {
    if (adminData.isSuperAdmin) {
      const { name } = req.body;
      const packageData = await Package.findOne({ name: name });
      if (packageData) {
        return next(errorHandler(401, "Package Already Exist"));
      } else {
        const newPackage = await Package.create(req.body);
        res.status(200).json({
          newPackage,
          sts: "01",
          msg: "Package added Success",
        });
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    next(error);
  }
};

//view all users by Admin
export const viewAllUsers = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const userData = await User.find({ isSuperAdmin: { $ne: true } }).select(
      "username email phone userStatus"
    );
    if (user) {
      return res.status(201).json({
        userData,
      });
    } else {
      next(errorHandler("User not found"));
    }
  } catch (error) {
    next(error);
  }
};

//View approved (verified) users

export const getApprovedUsers = async (req, res, next) => {
  const userId = req.user._id;
  const adminData = await User.findById(userId);
  try {
    if (adminData.isSuperAdmin) {
      const userData = await User.find({
        userStatus: { $eq: "approved" },
      }).select("username email phone userStatus");
      res.status(200).json({
        userData,
        sts: "01",
        msg: "get approved users Success",
      });
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    next(error);
  }
};

// view Users to Approve

export const getReadyToApproveUsers = async (req, res, next) => {
  const userId = req.user._id;
  const adminData = await User.findById(userId);
  try {
    if (adminData.isSuperAdmin) {
      const userData = await User.find({
        userStatus: { $eq: "readyToApprove" },
      }).select("username email phone userStatus");
      res.status(200).json({
        userData,
        sts: "01",
        msg: "get approved users Success",
      });
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    next(error);
  }
};

//admin can verify users

export const acceptUser = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const { id } = req.params;
    console.log(id);

    const adminData = await User.findById(adminId);
    if (adminData.isSuperAdmin) {
      const userData = await User.findById(id);
      console.log(userData);
      // const sponserId=userData.sponser;
      if (userData) {
        userData.userStatus = "approved";

        const updatedUser = await userData.save();
        if (updatedUser) {
            // const referalIncome=generateReferalIncome(sponserId,updatedUser.packageAmount)
          res.status(200).json({updatedUser, msg: "User verification Accepted!" });
        }
      } else {
        next(errorHandler("User not Found"));
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    next(error);
  }
};

//admin can reject the users

export const rejectUser = async (req, res, next) => {
    try {
      const adminId = req.user._id;
      const { userId } = req.params;
      const adminData = await User.findById(adminId);
      if (adminData.isSuperAdmin) {
        const userData = await User.findById(userId);
        if (userData) {
          userData.userStatus = "pending";
            
          const updatedUser = await userData.save();
  
          if (updatedUser) {
            res.status(200).json({ msg: "User verification rejected!" });
          }
        } else {
          next(errorHandler("User not Found"));
        }
      } else {
        return next(errorHandler(401, "Admin Login Failed"));
      }
    } catch (error) {
      next(error);
    }
  };



   //view add fund pending by admin

   export const viewAddFundPending = async (req, res, next) => {
    const userId = req.user._id;
    const adminData = await User.findById(userId);
    try {
      if (adminData.isSuperAdmin) {
        const userData = await User.find({
          addFundStatus: { $eq: "pending" },
        }).select("username email phone userStatus");
        res.status(200).json({
          userData,
          sts: "01",
          msg: "get Fund add pending users Success",
        });
      } else {
        return next(errorHandler(401, "Admin Login Failed"));
      }
    } catch (error) {
      next(error);
    }
  };

  //admin can Approve users fund adding 

export const approveFundAdd = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const { id } = req.params;

    const adminData = await User.findById(adminId);
    if (adminData.isSuperAdmin) {
      let previousPackage;
      const userData = await User.findById(id);
      const packageAmount=userData.packageAmount;
      if(packageAmount) previousPackage = findPackage(packageAmount);
      const amountToAdd=userData.topUpAmount;
      const newPackageAmount=packageAmount+amountToAdd;
      const transactionCode=userData.transactionCode;
      const packageChosen = findPackage(newPackageAmount);
      const packageData = await Package.findOne({ name: packageChosen });
      if (userData) {
        userData.addFundStatus = "approved";
        userData.packageAmount=newPackageAmount;
        userData.previousPackage=previousPackage;
        userData.packageChosen=packageData._id;
        userData.transactionCode=""
        userData.addFundHistory.push({
          topUpAmount:amountToAdd,
          status:"approved",
          name:userData.username,
          transactionCode:transactionCode
        })
        userData.topUpAmount=0;
        const updatedUser = await userData.save();
        if (updatedUser) {
          res.status(200).json({updatedUser, msg: "User verification Accepted!" });
        }
      } else {
        next(errorHandler("User not Found"));
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//admin can approve Capital fund withdrawal

export const approveCapitalwithdrawal = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const { id } = req.params;

    const adminData = await User.findById(adminId);
    if (adminData.isSuperAdmin) {
      let previousPackage;
      const userData = await User.findById(id);
      const packageAmount=userData.packageAmount;
      previousPackage = findPackage(packageAmount);
      const withdrawAmount=userData.withdrawAmount;
      const newPackageAmount=packageAmount-withdrawAmount;
      const transactionCode=userData.transactionCode;
      const tnxID=userData.transactionID;
      const packageChosen = findPackage(newPackageAmount);
      const packageData = await Package.findOne({ name: packageChosen });
      if (userData) {
        userData.withdrawStatus = "approved";
        userData.packageAmount=newPackageAmount;
        userData.previousPackage=previousPackage;
        userData.packageChosen=packageData._id;
        userData.withdrawAmount=0;
        userData.transactionCode="";
        userData.transactionID="";
        userData.capitalWithdrawHistory.push({
          tnxID:tnxID,
          withdrawAmount: withdrawAmount,
          walletUrl:transactionCode,
          status:"Approved"
        })
        const updatedUser = await userData.save();
        if (updatedUser) {
          res.status(200).json({updatedUser, msg: "User Withdraw request Accepted!" });
        }
      } else {
        next(errorHandler("User not Found"));
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};



//admin can approve Capital fund withdrawal

export const approveWalletWithdrawal = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const { id } = req.params;

    const adminData = await User.findById(adminId);
    if (adminData.isSuperAdmin) {
      const userData = await User.findById(id);
      const walletAmount=userData.walletAmount;
      const withdrawAmount=userData.walletWithdrawAmount;
      const newWalletAmount=walletAmount-withdrawAmount;
      const transactionCode=userData.walletTransactionCode;
      const tnxID=userData.transactionID;
      if (userData) {
        userData.walletWithdrawStatus = "approved";
        userData.walletAmount=newWalletAmount;
        userData.walletWithdrawAmount=0;
        userData.walletTransactionCode="";
        userData.transactionID="";
        userData.walletWithdrawHistory.push({
          tnxID:tnxID,
          withdrawAmount: withdrawAmount,
          walletUrl:transactionCode,
          status:"Approved"
        })
        const updatedUser = await userData.save();
        if (updatedUser) {
          res.status(200).json({updatedUser, msg: "User Wallet Withdraw request Accepted!" });
        }
      } else {
        next(errorHandler("User not Found"));
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//admin reject user wallet withdrawal request
  
export const rejectWalletWithdrawal = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const { id } = req.params;

    const adminData = await User.findById(adminId);
    if (adminData.isSuperAdmin) {
      const userData = await User.findById(id);
      const withdrawAmount=userData.walletWithdrawAmount;
      const transactionCode=userData.walletTransactionCode;
      const tnxID=userData.transactionID;
      if (userData) {
        userData.walletWithdrawStatus = ""; 
        userData.walletWithdrawAmount=0;
        userData.walletTransactionCode="";
        userData.transactionID="";
        userData.capitalWithdrawHistory.push({
          tnxID:tnxID,
          withdrawAmount: withdrawAmount,
          walletUrl:transactionCode,
          status:"Rejected"
        })
        const updatedUser = await userData.save();
        if (updatedUser) {
          res.status(200).json({updatedUser, msg: "User Wallet Withdraw request Rejected!" });
        }
      } else {
        next(errorHandler("User not Found"));
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};


//view pending capital withdraw requestes

export const viewWithdrawPending = async (req, res, next) => {
  const userId = req.user._id;
  const adminData = await User.findById(userId);
  try {
    if (adminData.isSuperAdmin) {
      const userData = await User.find({
        withdrawStatus: { $eq: "pending" },
      }).select("username email phone withdrawStatus withdrawAmount");
      res.status(200).json({
        userData,
        sts: "01",
        msg: "get withdraw pending users Success",
      });
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    next(error);
  }
};


//view pending wallet withdraw requestes

export const viewWalletWithdrawPending = async (req, res, next) => {
  const userId = req.user._id;
  const adminData = await User.findById(userId);
  try {
    if (adminData.isSuperAdmin) {
      const userData = await User.find({
        walletWithdrawStatus: { $eq: "pending" },
      }).select("username email phone walletWithdrawStatus walletWithdrawAmount");
      res.status(200).json({
        userData,
        sts: "01",
        msg: "get wallet withdraw pending users Success",
      });
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    next(error);
  }
};


//admin reject user withdrawal request
  
export const rejectCapitalwithdrawal = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const { id } = req.params;

    const adminData = await User.findById(adminId);
    if (adminData.isSuperAdmin) {
      const userData = await User.findById(id);
      const withdrawAmount=userData.withdrawAmount;
      const transactionCode=userData.transactionCode;
      const tnxID=userData.transactionID;
      if (userData) {
        userData.withdrawStatus = "";
        userData.withdrawAmount=0;
        userData.transactionCode="";
        userData.transactionID="";
        userData.capitalWithdrawHistory.push({
          tnxID:tnxID,
          withdrawAmount: withdrawAmount,
          walletUrl:transactionCode,
          status:"Rejected"
        })
        const updatedUser = await userData.save();
        if (updatedUser) {
          res.status(200).json({updatedUser, msg: "User Withdraw request Rejected!" });
        }
      } else {
        next(errorHandler("User not Found"));
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//admin approve initial package

export const userPackageApproval=async(req,res,next)=>{
  try{
    const adminId = req.user._id;
    const { id } = req.params;

    const adminData = await User.findById(adminId);
    if (adminData.isSuperAdmin) {
      const userData = await User.findById(id);
      const packageAmount=userData.packageAmount;
      
      const sponserId=userData.sponser;
      const amountToAdd=userData.topUpAmount;
      const transactionCode=userData.transactionCode;
      const newPackageAmount=packageAmount+amountToAdd
      const packageChosen = findPackage(newPackageAmount);
      const packageData = await Package.findOne({ name: packageChosen });
      if (userData) {
        userData.addFundStatus = "approved";
        userData.referalStatus="approved";
        userData.packageAmount=newPackageAmount;
        userData.packageChosen=packageData._id; 
        userData.transactionCode=transactionCode
        userData.addFundHistory.push({
          topUpAmount:amountToAdd,
          status:"approved",
          name:userData.username,
          transactionCode:transactionCode
        })
        userData.topUpAmount=0;
        userData.transactionCode='';
        const updatedUser = await userData.save();
        if (updatedUser) {
          const referalIncome=generateReferalIncome(id,sponserId,updatedUser.packageAmount)
          res.status(200).json({updatedUser,referalIncome, msg: "New package added successfull! Referal amount approved!" });
        }
      } else {
        next(errorHandler("User not Found"));
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }


  }catch(error){
    console.log(error);
    next(error)
  }

}






//admin Reject initial package

export const userPackageReject=async(req,res,next)=>{
  try{
    const adminId = req.user._id;
    const { id } = req.params;

    const adminData = await User.findById(adminId);
    if (adminData.isSuperAdmin) {
      const userData = await User.findById(id);
      // const packageAmount=userData.packageAmount;      
      // const sponserId=userData.sponser;
      const amountToAdd=userData.topUpAmount;
      const transactionCode=userData.transactionCode;
      // const newPackageAmount=packageAmount+amountToAdd
      // const packageChosen = findPackage(newPackageAmount);
      // const packageData = await Package.findOne({ name: packageChosen });
      if (userData) {
        userData.addFundStatus = "pending";
        userData.referalStatus="";
        // userData.packageAmount=newPackageAmount;
        // userData.packageChosen=packageData._id;
        // userData.transactionCode=transactionCode
        userData.addFundHistory.push({
          topUpAmount:amountToAdd,
          status:"Rejected",
          name:userData.username,
          transactionCode:transactionCode
        })
        userData.topUpAmount=0;
        userData.transactionCode='';
        const updatedUser = await userData.save();
        if (updatedUser) {
          // const referalIncome=generateReferalIncome(id,sponserId,updatedUser.packageAmount)
          res.status(200).json({updatedUser, msg: "New package added Rejected! Referal amount approved!" });
        }
      } else {
        next(errorHandler("User not Found"));
      }
    } else {
      return next(errorHandler(401, "Admin Login Failed"));
    }


  }catch(error){
    next(error)
  }

}