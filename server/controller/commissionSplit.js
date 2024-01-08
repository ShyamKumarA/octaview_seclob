import { errorHandler } from "../middleware/errorHandler.js";
import User from "../models/userModel.js";



export const allUserCommissionSplit=async(req,res,next)=>{
    const {percentage}=req.body;
    console.log("percentage:",percentage);
    try {
        const userData = await User.find({ isSuperAdmin: { $ne: true }, packageAmount: { $ne: 0 } });

        if(userData){
            userData.forEach(async(user)=>{
                
                const capitalAmount=user.packageAmount;
                const dailyROI=(capitalAmount*percentage)/100;
                user.dailyROI=dailyROI;
                user.dailyROIHistory.push({
                    name:user.username ,
                    capitalAmount:user.capitalAmount,
                    percentage:percentage,
                    creditedAmount: dailyROI,
                })
                    await user.save();
               
                      
            })

        // Assuming allUserCommissionSplit has been executed

const allUsers = await User.find({ isSuperAdmin: { $ne: true }, packageAmount: { $ne: 0 } });

allUsers.forEach(async (user) => {
  await user.calculateLevel1ROI();
  await user.calculateLevel2ROI();
  await user.calculateLevel3ROI();
});

        
        
        

        res.status(200).json({
            msg: "Commission split Success",
          });


            
        }else{
            next(errorHandler("No Users are Found"))
        }

        
    } catch (error) {
        next(error)
    }

}





