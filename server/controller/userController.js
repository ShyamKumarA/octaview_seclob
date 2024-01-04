import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler.js";
import upload from "../config/multiFileUpload.js";
import Package from "../models/packageModel.js";
import sendMail from "../config/mailer.js";



//User signUp
export const signup = async (req, res, next) => {
  const { password, username, email, address, phone } = req.body;
  const ownSponserId = generateRandomString();
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    password: hashedPassword,
    username,
    email,
    address,
    ownSponserId,
    phone,
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};


// user login

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(401, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }
    const token = jwt.sign({ userId: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.status(200).json({
      id: validUser._id,
      firstName: validUser.username,
      email: validUser.email,
      token_type: "Bearer",
      access_token: token,
      sts: "01",
      msg: "Login Success",
    });
  } catch (error) {
    next(error);
  }
};

//find user package with capital amount

export const findPackage = (depositAmount) => {
  if (depositAmount >= 50 && depositAmount <= 999) {
    return "Bronza";
  } else if (depositAmount >= 1000 && depositAmount <= 4999) {
    return "Silver";
  } else if (depositAmount >= 5000 && depositAmount <= 14999) {
    return "Gold";
  } else if (depositAmount >= 15000 && depositAmount <= 29999) {
    return "Diamond";
  } else if (depositAmount >= 30000) {
    return "Platinum";
  } else {
    return "Unknown";
  }
};

//generate sponser random code

export const generateRandomString = () => {
  const baseString = "OCV";
  const randomDigits = Math.floor(Math.random() * 999999);
  return baseString + randomDigits.toString();
};

//generate referal income for all

export const generateReferalIncome = async (userId,id, capitalAmount) => {
  const referalIncome = capitalAmount * 0.05;
  const sponserData = await User.findById(id);
  const userData=await User.findById(userId);
  if(sponserData){
    const totalRaferal = sponserData.referalIncome + referalIncome;
    sponserData.referalIncome=totalRaferal;
    sponserData.referalHistory={
      userID:userId,
      name:userData.username,
      amountCredited:totalRaferal,
      status:"Approved"
    }
    const updatedSponser = await sponserData.save();
  if(updatedSponser){
  return totalRaferal;

  }
  
  }else{
    next(errorHandler("Sponser not found"))
  }
  
};

//add user by user and admin

export const addUser = async (req, res, next) => {
  try {
    const sponser = req.user._id;
    console.log(sponser);
    const userStatus = "pending";

    const sponserUser1 = await User.findById(sponser);
    console.log(sponserUser1);

    let sponserUser2, sponserUser3;

    const sponserId2 = sponserUser1.sponser||null;
    if (sponserId2) { 
      sponserUser2 = await User.findById(sponserId2);
      console.log(sponserUser2);
    }
    if (sponserUser2) {
    const sponserId3 = sponserUser2.sponser||null;
      sponserUser3 = await User.findById(sponserId3);
      console.log(sponserUser3);
    }

    const ownSponserId = generateRandomString();

    const { username, email, phone, address,transactionPassword, password } =
      req.body;
    // const packageChosen = findPackage(packageAmount);
    // const packageData = await Package.findOne({ name: packageChosen });
    //console.log(packageData);
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const hashedTxnPassword = bcryptjs.hashSync(transactionPassword, 10);

    const existingUser = await User.findOne({ email });
    const existingUserByPhone = await User.findOne({ phone });

    if (existingUser || existingUserByPhone) {
      return next(errorHandler(401, "User Already Exist"));
    }

    const earning = 0;

    const user = await User.create({
      sponser,
      username,
      email,
      phone,
      address,
      addFundStatus,
      transactionPassword:hashedTxnPassword,
      // packageAmount,
      // packageChosen: packageData._id,
      password: hashedPassword,
      ownSponserId,
      earning,
      userStatus,
    });
    if (user) {
      if(sponserUser3){
        sponserUser3.childLevel3.push(user._id);
        await sponserUser3.save();
      }
      if(sponserUser2){
        sponserUser2.childLevel2.push(user._id);
        await sponserUser2.save();
      }
      if (sponserUser1) {
        sponserUser1.childLevel1.push(user._id);
        const updatedUser = await sponserUser1.save();     
       
        if (updatedUser) {
          await sendMail(
            user.email,
            // packageChosen,
            // packageAmount,
            user.username,
            user.ownSponserId,
            transactionPassword,
            password
          );
        }

        res.json({
          _id: user._id,
          sponser: user.sponser,
          name: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          FundStatus:addFundStatus,
          // packageAmount: user.packageAmount,
          // packageChosen: user.packageChosen,
          ownSponserId: user.ownSponserId,
          earning: user.earning,
          myChild1: user.childLevel1,
          myChild2: user.childLevel2,
          myChild3: user.childLevel3,
          isSuperAdmin: user.isSuperAdmin,
          userStatus: user.userStatus,
        });
      } else {
        return next(
          errorHandler(400, "Some error occured. Make sure you are logged in!")
        );
      }
    } else {
      return next(errorHandler(400, "Registration failed. Please try again!"));
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};


//verify users using Aadhaar card and Pancard

export const verifyUser = async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return next(errorHandler(400, "File upload error"));
      }
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (user) {
        const aadhaarImage = req.files["aadhaar"][0];
        const pancardImage = req.files["pancard"][0];

        if (!aadhaarImage || !pancardImage) {
          return next(
            errorHandler(400, "Both Aadhaar and Pancard images are required")
          );
        }

        user.aadhaar = aadhaarImage.filename;
        user.pancard = pancardImage.filename;
        user.userStatus = "readyToApprove";

        const updatedUser = await user.save();
        if (updatedUser) {
          return res.status(201).json({
            updatedUser,
            sts: "01",
            msg: "User verification in progress!",
          });
        } else {
          return next(
            errorHandler(401, "Verification failed. Please try again!")
          );
        }
      } else {
        return next(errorHandler(401, "User not found"));
      }
    });
  } catch (error) {
    next(error);
  }
};


//View Profile

export const viewUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const userData = await User.findById(userId).select(
      "username email phone userStatus packageAmount"
    );
    if (userData) {
      res.status(200).json({
        userData,
        sts: "01",
        msg: "get user profile Success",
      });
    } else {
      next(errorHandler("User not found"));
    }
  } catch (error) {
    next(error);
  }
};


// edit user profile

export const editProfile = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const userData = await User.findById(userId);
    if (userData) {
      const { username, phone, address } = req.body;
      
      userData.username = username || userData.username;
      userData.address = address || userData.address;
      userData.phone = phone || userData.phone;

      const updatedUser = await userData.save();

      res
        .status(200)
        .json({ updatedUser, sts: "01", msg: "Successfully Updated" });
    } else {
      next(errorHandler("User not found, Please Login first"));
    }
  } catch (error) {
    next(error);
  }
};

//view child nodes(tree)

export const viewChilds = async (req, res, next) => {
  const userId = req.query.id || req.user._id;
  try {
    const userChilds = await User.findById(userId).populate({
      path: "myChilds",
      select: "username email userStatus packageAmount",
    });

    if (userChilds) {
      const childs = userChilds.myChilds;
      res.status(200).json({ childs, sts: "01", msg: "Success" });
    } else {
      next(errorHandler("No child Found"));
    }
  } catch (error) {
    next(error);
  }
};


//view all packages

export const viewAllPackage=async(req,res,next)=>{
  const userId=req.user._id;
  try {
    const userData=await User.findById(userId);
    if(userData){
      const PackageData=await Package.find();
      res
      .status(200)
      .json({ PackageData, sts: "01", msg: "Successfully Updated" });

    }else{
      next(errorHandler("User Not Found"))
    }
  } catch (error) {
    next(error)
  }
}


//view all packages

export const viewUserPackageDetails=async(req,res,next)=>{
  const userId=req.user._id;
  console.log(userId);
  try {
    const userData=await User.findById(userId).populate("packageChosen");
    if(userData){
     const PackageData= userData.packageChosen
     console.log(PackageData);
     if(PackageData){
      res
      .status(200)
      .json({ PackageData, sts: "01", msg: "Successfully Found Package data" });
     }
    }else{
      next(errorHandler("User Not Found"))
    }
  } catch (error) {
    next(error)
  }
}

   // Add Fund to capital Amount by user

   export const AddFund=async(req,res,next)=>{
    const userId=req.user._id;
    const {amount}=req.body;
    try {
      const user=await User.findById(userId);
      if(user){
        user.addFundStatus = "pending";
        user.topUpAmount=amount;

            
        const updatedUser = await user.save();

        if (updatedUser) {
          res.status(200).json({ msg: "User Fund top up request send to admin" });
        }
      } else {
        next(errorHandler("User not Found"));
      }

    } catch (error) {
      next(error)
    }
   }

   //change password

   export const changePassword=async(req,res,next)=>{
    const userId=req.user._id;
    const userData=await User.findById(userId)
    try {
      if(userData){
        const {password,newPassword}=req.body;
      if (password) {
        const validPassword = bcryptjs.compareSync(password, userData.password);
        if (!validPassword) {
          return next(errorHandler(401, "Wrong Password"));
        } else {
          const hashedPassword = bcryptjs.hashSync(newPassword, 10);
          userData.password = hashedPassword;
        }
      }

       const updatedUser = await userData.save();

      res
        .status(200)
        .json({ updatedUser, sts: "01", msg: "Successfully Updated" });
    } else {
      next(errorHandler("User not found, Please Login first"));
    }
      
      
    } catch (error) {
      next(error)
    }
  }



  //change transation password 

  export const changeTxnPassword=async(req,res,next)=>{
    const userId=req.user._id;
    const userData=await User.findById(userId)
    try {
      if(userData){
        const {password,newPassword}=req.body;
      if (password) {
        const validPassword = bcryptjs.compareSync(password, userData.password);
        if (!validPassword) {
          return next(errorHandler(401, "Wrong Password"));
        } else {
          const hashedPassword = bcryptjs.hashSync(newPassword, 10);
          userData.password = hashedPassword;
        }
      }

       const updatedUser = await userData.save();

      res
        .status(200)
        .json({ updatedUser, sts: "01", msg: "Successfully Updated" });
    } else {
      next(errorHandler("User not found, Please Login first"));
    }
      
      
    } catch (error) {
      next(error)
    }
  }
   

  export const addPackageByUser=async(req,res,next)=>{
    const userId=req.user._id;
    try {
    const {amount,transactionPassword,transactionCode}=req.body;
    console.log(transactionPassword);
      const userData=await User.findById(userId)
      console.log(userData);
      if(userData){
        const validPassword = bcryptjs.compareSync(transactionPassword, userData.transactionPassword);
        if (!validPassword) {
          return next(errorHandler(401, "Wrong Transaction Password"));
        } else {
          userData.addFundStatus ="pending";
          userData.topUpAmount=amount;
          userData.transactionCode=transactionCode;
          

            
        const updatedUser = await userData.save();

        if (updatedUser) {
          res.status(200).json({updatedUser, msg: "User Fund top up request send to admin" });
        }
          
        }

      }else{
      next(errorHandler("User not found, Please Login first"));

      }
    } catch (error) {
      console.log(error);
      next(error)
    }
  }