import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorHandler } from "../middleware/errorHandler.js";
import upload from "../config/multiFileUpload.js";
import Package from "../models/packageModel.js";
import sendMail from "../config/mailer.js";





  export const signup=async(req,res,next)=>{
      const {password,username,email,address,phone}=req.body;
      const ownSponserId = generateRandomString();
      const hashedPassword=bcryptjs.hashSync(password,10);
      const newUser = new User({ password: hashedPassword,username,email,address, ownSponserId,phone});
      try {
          const user=await newUser.save()
      res.status(201).json(user)
          
      } catch (error) {
          next(error)
      }
      
  }

export const userLogin=async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const validUser=await User.findOne({email});

        if(!validUser){
            return next(errorHandler(401,'User not found'))
        }
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(401,'Wrong credentials'))
        }
        const token = jwt.sign(
            { userId: validUser._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "365d",
            }
          );
      
          res.status(200).json({
            id: validUser._id,
            firstName: validUser.username,
            email: validUser.email,
            token_type: "Bearer",
            access_token: token,
            sts: "01",
            msg: "Login Success",
          });
        
    }catch(error){
        next(error);
    }
}

const findPackage=(depositAmount)=>{
  if (depositAmount >= 50 && depositAmount <= 999) {
    return 'Bronza';
} else if (depositAmount >= 1000 && depositAmount <= 4999) {
    return 'Silver';
} else if (depositAmount >= 5000 && depositAmount <= 14999) {
    return 'Gold';
} else if (depositAmount >= 15000 && depositAmount <= 29999) {
    return 'Diamond';
} else if (depositAmount >= 30000) {
    return 'Platinum';
} else {
    return 'Unknown';
}
}


export const generateRandomString = () => {
  const baseString = "OCV";
  const randomDigits = Math.floor(Math.random() * 999999);
  return baseString + randomDigits.toString();
};

const generateReferalIncome=async(id,capitalAmount)=>{
    const referalIncome=capitalAmount*(0.05)
    const sponserData=await User.findById(id)
    const totalRaferal= sponserData.referalIncome+referalIncome;
    const updateReferal=await User.findByIdAndUpdate(id,{referalIncome:totalRaferal})
    return updateReferal
}

export const addUser=async(req,res,next)=>{
  try {
    const sponser = req.user._id;

    const userStatus = "pending";

    const sponserUser = await User.findById(sponser);
    const ownSponserId = generateRandomString();

    const { username, email, phone, address, packageAmount, password } = req.body;

    const packageChosen=findPackage(packageAmount)
    const packageData=await Package.findOne({name:packageChosen})
    //console.log(packageData);
    const hashedPassword=bcryptjs.hashSync(password,10);

    const existingUser = await User.findOne({ email });
    const existingUserByPhone = await User.findOne({ phone });

    if (existingUser || existingUserByPhone) {
      return next(errorHandler(401,'User Already Exist'))
    }


    const earning = 0;

 

    const user = await User.create({
      sponser,
      username,
      email,
      phone,
      address,
      packageAmount,
      packageChosen:packageData._id,
      password:hashedPassword,
      ownSponserId,
      earning,
      userStatus
    });
    if (user) {
      if (sponserUser) {
        sponserUser.myChilds.push(user._id);

          const updatedUser = await sponserUser.save();

        if (updatedUser) {
          await sendMail(user.email,packageChosen,packageAmount, user.username, user.ownSponserId, password);
        }

        res.json({
          _id: user._id,
          sponser: user.sponser,
          name: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          packageAmount:user.packageAmount,
          packageChosen: user.packageChosen,
          ownSponserId: user.ownSponserId,
          earning: user.earning,
          myChilds: user.myChilds,
          isSuperAdmin: user.isSuperAdmin,
          userStatus: user.userStatus,
        });
      } else {
      return next(errorHandler(400,'Some error occured. Make sure you are logged in!'))
      }
    } else {
      return next(errorHandler(400,'Registration failed. Please try again!'))
      
    }
    
  } catch (error) {
    next(error)
  }
}
 
  
 export const verifyUser=async (req, res,next) => {
        try {
            upload(req, res, async function (err) {

                if (err) {
                    return next(errorHandler(400,'File upload error'))
                }
                 const userId = req.user._id;
                const user = await User.findById(userId);

                const sponserId=user.sponser;
                console.log(sponserId);
                
          
                if (user) {
                  const aadhaarImage = req.files["aadhaar"][0];
                  const pancardImage = req.files["pancard"][0];
          
                  if (!aadhaarImage || !pancardImage) {
                    return next(errorHandler(400,'Both Aadhaar and Pancard images are required'))
                  }
          
                  user.aadhaar = aadhaarImage.filename;
                  user.pancard = pancardImage.filename;
                  user.userStatus = "readyToApprove";
          
                  const updatedUser = await user.save();
                  if (updatedUser) {
                    const referalIncome=generateReferalIncome(sponserId,updatedUser.packageAmount)
                    return res.status(201).json({
                      updatedUser,
                      referalIncome,
                      sts: "01",
                      msg: "User verification in progress!",
                    });
                  } else {
                    return next(errorHandler(401,'Verification failed. Please try again!'))
                  }
                } else {
                    return next(errorHandler(401,'User not found'))
        
                }
              });
        } catch (error) {
            next(error)
        }
            
      
    };




   export const editProfile=async(req,res,next)=>{
      const userId=req.user._id;
      try {
        const userData=await User.findById(userId)
        if(userData){
          const{username,phone,address,password,newPassword}=req.body
          if (password) {
            const validPassword=bcryptjs.compareSync(password,userData.password);
        if(!validPassword){
            return next(errorHandler(401,'Wrong credentials'))
        }else{
          const hashedPassword = bcryptjs.hashSync(newPassword, 10);
            userData.password = hashedPassword;
        }       
          }
          userData.username = username || userData.username;
          userData.address = address || userData.address;
          userData.phone = phone || userData.phone;

    const updatedUser = await userData.save();

    res.status(200).json(
      {updatedUser,
      sts: "01",
      msg: "Successfully Updated"})
        }else{
          next(errorHandler("User not found, Please Login first"))
        }
      } catch (error) {
        next(error)
      }
   }
  


   export const viewChilds=async(req,res,next)=>{
     const userId=req.query.id||req.user._id;
     try {
      const userChilds = await User.findById(userId).populate({
        path: "myChilds",
        select: "username email userStatus packageAmount",
      });
      
      if(userChilds){
        const childs=userChilds.myChilds
        res.status(200).json(
      {childs,
      sts: "01",
      msg: "Success"})
      }else{
        next(errorHandler("No child Found"))
      }
      
     } catch (error) {
      next(error)
     }
     
   }
