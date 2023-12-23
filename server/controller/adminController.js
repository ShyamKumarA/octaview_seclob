import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorHandler } from "../middleware/errorHandler.js";
import Package from "../models/packageModel.js";
import { generateRandomString } from "./userController.js";


export const addAdmin=async(req,res,next)=>{
    const {password,username,email,address,phone,isSuperAdmin}=req.body;
    try {
    const adminData=await User.findOne({email:email});
    console.log(adminData);
    const ownSponserId = generateRandomString();
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser = new User({ password: hashedPassword,username,email,address,ownSponserId,isSuperAdmin,phone});
        if(!adminData){
            const user=await newUser.save()
    res.status(201).json(user)
        }else{
            return next(errorHandler("User not found"))
        }     
    } catch(error) {
        next(error)
    }
    
}

export const adminLogin=async(req,res,next)=>{
    
    const {email,password}=req.body;
    try{
        const validAdmin=await User.findOne({email});
        if(!validAdmin){
            return next(errorHandler(401,'User not found'))
        }
        if(validAdmin.isSuperAdmin){
            const validPassword=bcryptjs.compareSync(password,validAdmin.password);
        if(!validPassword){
            return next(errorHandler(401,'Wrong credentials'))
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
        }else{
            return next(errorHandler(401,'it is Not Admin'))
        }
        
        
    }catch(error){
        next(error);
    }
    
}

export const addPackage=async(req,res,next)=>{
    const adminId = req.user._id;
    const adminData=await User.findById(adminId);
    try{
        if(adminData.isSuperAdmin){
            const {name}=req.body;
        const packageData=await Package.findOne({name:name})
        if(packageData){
           return next(errorHandler(401,'Package Already Exist'))
        }else{
         const newPackage = await Package.create(req.body);
         res.status(200).json({
            newPackage,
            sts: "01",
            msg: "Package added Success",
          });
        }
        }else{
           return next(errorHandler(401,'Admin Login Failed'))

        }
        
    }catch(error){
    next(error)
    }
}