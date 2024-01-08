import mongoose from 'mongoose'
import Package from './packageModel.js';

const transactionSchema = new mongoose.Schema(
    {
      referenceID: String,
      amount: Number,
      TDSAmount: Number,
      lastAmount: Number,
      status: String,
    },
    {
      timestamps: true,
    }
  );

  const allTransactionSchema = new mongoose.Schema(
    {
      userID: String,
      name: String,
      amount: Number,
      transactionCode:String,
      status: String
    },
    {
      timestamps: true,
    }
  )

  const levelROISchema=new mongoose.Schema(
    {
      userID:String,
      name:String,
      dayROI:Number,
      capitalAmount:Number,
      LevelAmountCredited:Number,
    },
    {
      timestamps: true,
    }
  )

  const dailyROISchema = new mongoose.Schema(
    {
      name: String,
      capitalAmount:Number,
      percentage:Number,
      creditedAmount: Number,    
    },
    {
      timestamps: true,
    }
  )

  const addFundSchema = new mongoose.Schema(
    {
      name: String,
      topUpAmount: Number,
      transactionCode:String,
      status: String
    },
    {
      timestamps: true,
    }
  )
  const ReferalAmountSchema = new mongoose.Schema(
    {
      userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      name: String,
      amountCredited: Number,
      transactionCode:String,
      status: String
    },
    {
      timestamps: true,
    }
  )

const userSchema=new mongoose.Schema({
  sponser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
      },
    address: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true
    },
    transactionPassword:{
      type:String,
    },
    aadhaar: {
        type: String,
        default: null,
      },
    pancard: {
        type: String,
        default: null,
      },
    dailyROI: {
        type: Number,
        default: 0,
    },
    level1ROI:{
      type: Number,
        default: 0,
    },
    level2ROI:{
      type: Number,
        default: 0,
    },
    level3ROI:{
      type: Number,
        default: 0,
    },
    level1ROIHistory:[levelROISchema],
    level2ROIHistory:[levelROISchema],
    level3ROIHistory:[levelROISchema],
    dailyROIHistory:[dailyROISchema],
    referalIncome:{
      type:Number,
      default:0
    },
    referalHistory:[ReferalAmountSchema],
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    ownSponserId: {
      type: String,
      required: true,
    },
    packageAmount:{
      type: Number,
      default:0
    },
    previousPackage:{
      type: String,
      default:"Bronza"
    },
    packageChosen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
    },
    addFundHistory: [addFundSchema],
    topUpAmount:{
      type:Number
    },
    transactionCode:{
      type:String,
    },
    referalStatus:{
      type: String,
      enum: ["initiated", "approved"],
    },
    addFundStatus:{
      type: String,
      enum: ["pending", "approved"],
    },
    userStatus: {
        type: String,
        enum: ["pending", "readyToApprove", "approved"],
      },
      transactions: [transactionSchema],
      allTransactions: [allTransactionSchema],
      childLevel1:[{type:mongoose.Schema.Types.ObjectId,
        ref:"User"}],
      childLevel2:[{type:mongoose.Schema.Types.ObjectId,
        ref:"User"}],
      childLevel3:[{type:mongoose.Schema.Types.ObjectId,
        ref:"User"}],
},{timestamps:true});

// Assuming the existing userSchema definition

userSchema.methods.calculateLevel1ROI = async function () {
  const packageData = await Package.findOne({ _id: this.packageChosen  });
  const packageName=packageData.name;
  const minMembers=packageData.minMembers;
  const directMemberCount=this.childLevel1.length;
  const previousPackage=this.previousPackage;

if(minMembers>directMemberCount){
  if(previousPackage==="Bronza"){
    const childLevel1Users = await User.find({ _id: { $in: this.childLevel1 } });
    if(childLevel1Users.length>0){
      let level1ROISum = 0;
  
      for (const user of childLevel1Users) {
  
        if(user.packageAmount!=0){
        const level1ROI = (user.dailyROI * 8) / 100;
  
        this.level1ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level1ROI,
        });
  
        await this.save();
        level1ROISum += level1ROI;
      }
    }
    this.level1ROI = level1ROISum;
    await this.save();
    }
  }else{
    const packageData = await Package.findOne({ name: previousPackage });
    const childLevel1Users = await User.find({ _id: { $in: this.childLevel1 } });
    if(childLevel1Users.length>0){
      let level1ROISum = 0;
  
      for (const user of childLevel1Users) {
  
        if(user.packageAmount!=0){
        const level1ROI = (user.dailyROI * packageData.stage1) / 100;
  
        this.level1ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level1ROI,
        });
  
        await this.save();
        level1ROISum += level1ROI;
      }
    }
    this.level1ROI = level1ROISum;
    await this.save();
    }

  }
  
}else{
  const childLevel1Users = await User.find({ _id: { $in: this.childLevel1 } });
    if(childLevel1Users.length>0){
      let level1ROISum = 0;
  
      for (const user of childLevel1Users) {
  
        if(user.packageAmount!=0){
        const level1ROI = (user.dailyROI * packageData.stage1) / 100;
  
        this.level1ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level1ROI,
        });
  
        await this.save();
        level1ROISum += level1ROI;
      }
    }
    this.level1ROI = level1ROISum;
    await this.save();
    }

}
  
  
};



userSchema.methods.calculateLevel2ROI = async function () {
  const packageData = await Package.findOne({ _id: this.packageChosen  });
  const minMembers=packageData.minMembers;
  const directMemberCount=this.childLevel1.length;
  const previousPackage=this.previousPackage;

if(minMembers>directMemberCount){
  if(previousPackage==="Bronza"){
    const childLevel2Users = await User.find({ _id: { $in: this.childLevel2 } });
    if(childLevel2Users.length>0){
      let level2ROISum = 0;
  
      for (const user of childLevel2Users) {
  
        if(user.packageAmount!=0){
        const level2ROI = (user.dailyROI * 3) / 100;
  
        this.level1ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level2ROI,
        });
  
        await this.save();
        level2ROISum += level2ROI;
      }
    }
    this.level2ROI = level2ROISum;
    await this.save();
    }
  }else{
    const packageData = await Package.findOne({ name: previousPackage });
    const childLevel2Users = await User.find({ _id: { $in: this.childLevel2 } });
    if(childLevel2Users.length>0){
      let level2ROISum = 0;
  
      for (const user of childLevel2Users) {
  
        if(user.packageAmount!=0){
        const level2ROI = (user.dailyROI * packageData.stage2) / 100;
  
        this.level2ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level2ROI,
        });
  
        await this.save();
        level2ROISum += level2ROI;
      }
    }
    this.level2ROI = level2ROISum;
    await this.save();
    }

  }
  
}else{
  const childLevel2Users = await User.find({ _id: { $in: this.childLevel2 } });
    if(childLevel2Users.length>0){
      let level2ROISum = 0;
  
      for (const user of childLevel2Users) {
  
        if(user.packageAmount!=0){
        const level2ROI = (user.dailyROI * packageData.stage2) / 100;
  
        this.level2ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level2ROI,
        });
  
        await this.save();
        level2ROISum += level2ROI;
      }
    }
    this.level2ROI = level2ROISum;
    await this.save();
    }

}
  
  
};


userSchema.methods.calculateLevel3ROI = async function () {
  const packageData = await Package.findOne({ _id: this.packageChosen  });
  const minMembers=packageData.minMembers;
  const directMemberCount=this.childLevel1.length;
  const previousPackage=this.previousPackage;

if(minMembers>directMemberCount){
  if(previousPackage==="Bronza"){
    const childLevel3Users = await User.find({ _id: { $in: this.childLevel3 } });
    if(childLevel3Users.length>0){
      let level3ROISum = 0;
  
      for (const user of childLevel3Users) {
  
        if(user.packageAmount!=0){
        const level3ROI = (user.dailyROI * 1) / 100;
  
        this.level3ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level3ROI,
        });
  
        await this.save();
        level3ROISum += level3ROI;
      }
    }
    this.level3ROI = level3ROISum;
    await this.save();
    }
  }else{
    const packageData = await Package.findOne({ name: previousPackage });
    const childLevel3Users = await User.find({ _id: { $in: this.childLevel3 } });
    if(childLevel3Users.length>0){
      let level3ROISum = 0;
  
      for (const user of childLevel3Users) {
  
        if(user.packageAmount!=0){
        const level3ROI = (user.dailyROI * packageData.stage3) / 100;
  
        this.level3ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level3ROI,
        });
  
        await this.save();
        level3ROISum += level3ROI;
      }
    }
    this.level3ROI = level3ROISum;
    await this.save();
    }

  }
  
}else{
  const childLevel3Users = await User.find({ _id: { $in: this.childLevel3 } });
    if(childLevel3Users.length>0){
      let level3ROISum = 0;
  
      for (const user of childLevel3Users) {
  
        if(user.packageAmount!=0){
        const level3ROI = (user.dailyROI * packageData.stage3) / 100;
  
        this.level3ROIHistory.push({
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level3ROI,
        });
  
        await this.save();
        level3ROISum += level3ROI;
      }
    }
    this.level3ROI = level3ROISum;
    await this.save();
    }

}
  
  
};






// userSchema.methods.calculateLevel2ROI = async function () {

//   const childLevel2Users = await User.find({ _id: { $in: this.childLevel2 } });

//   if (childLevel2Users.length > 0) {
//     let level2ROISum = 0;

//     for (const user of childLevel2Users) {
//       if(user.packageAmount!=0){
//       const level2ROI = (user.dailyROI * 3) / 100;
//       //console.log(level2ROI);
//       this.level2ROIHistory.push({
//         userID: user.ownSponserId,
//         name: user.username,
//         dayROI: user.dailyROI,
//         capitalAmount: user.packageAmount,
//         LevelAmountCredited: level2ROI,
//       });

//       await this.save();
//       level2ROISum += level2ROI;
//     }
//   }

//     this.level2ROI = level2ROISum;
//     await this.save();
//   }
// };


// userSchema.methods.calculateLevel3ROI = async function () {
//   const childLevel3Users = await User.find({ _id: { $in: this.childLevel3 } });
//   if(childLevel3Users.length>0){
//   let level3ROISum = 0;

//   for (const user of childLevel3Users) {
//     if(user.packageAmount!=0){
//       const level3ROI = (user.dailyROI * 1) / 100;

//     this.level3ROIHistory.push({
//       userID: user.ownSponserId,
//       name: user.username,
//       dayROI: user.dailyROI,
//       capitalAmount: user.packageAmount,
//       LevelAmountCredited: level3ROI,
//     });

//     await this.save();
//     level3ROISum += level3ROI;

//     }
    
//   }

//   this.level3ROI = level3ROISum;
//   await this.save();
// }
// };


const User=mongoose.model("User",userSchema);

export default User;



