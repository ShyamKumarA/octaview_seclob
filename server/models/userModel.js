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
      reportName:String,
      userID:String,
      name:String,
      dayROI:Number,
      capitalAmount:Number,
      LevelAmountCredited:Number,
      percentage:Number
    },
    {
      timestamps: true,
    }
  )

  const dailyROISchema = new mongoose.Schema(
    {
      reportName:String,
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
  const withdrawSchema = new mongoose.Schema(
    {
      reportName:String,
      ownID:String,
      packageName:String,
      tnxID:String,
      withdrawAmount: Number,
      transactionCode:String,
      walletUrl:String,
      status:String
    },
    {
      timestamps: true,
    }
  )
  const ReferalAmountSchema = new mongoose.Schema(
    {
      reportName:String,
      userID:String,
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
    wallet:{
      type:Number
    },
    withdrawAmount:{
      type:Number
    },
    withdrawStatus:{
      type:String,
      enum:["pending","approved"]
    },
    transactionID:{
      type:String
    },
    
    capitalWithdrawHistory:[withdrawSchema],
    walletWithdrawHistory:[withdrawSchema],
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
    walletAmount:{
      type: Number,
      default:0
    },
    walletWithdrawAmount:{
      type: Number,
      default:0
    },
    walletWithdrawStatus:{
      type: String,
      enum: ["pending", "approved"],
    },
    packageAmount:{
      type: Number,
      default:0
    },
    packageName:{
      type:String
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
    walletTransactionCode:{
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
    addPackageStatus:{
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


userSchema.methods.calculateLevel1ROI = async function () {
  try {
    const packageData = await Package.findOne({ _id: this.packageChosen  });
  const minMembers=packageData.minMembers;
  
const approvedChildLevel1Count = this.childLevel1.filter(child => child.userStatus === "approved").length;



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
          reportName:"level1ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level1ROI,
          percentage:8
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
          reportName:"level1ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level1ROI,
          percentage:packageData.stage1
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
          reportName:"level1ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level1ROI,
          percentage:packageData.stage1
        });
  
        await this.save();
        level1ROISum += level1ROI;
      }
    }
    this.level1ROI = level1ROISum;
    await this.save();
    }

}

return this.level1ROI
    
  } catch (error) {
    next(error)
  }
  
  
  
};



userSchema.methods.calculateLevel2ROI = async function () {
  try {
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
  
        this.level2ROIHistory.push({
          reportName:"level2ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level2ROI,
          percentage:3
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
          reportName:"level2ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level2ROI,
          percentage:packageData.stage2
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
          reportName:"level2ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level2ROI,
          percentage:packageData.stage2
        });
  
        await this.save();
        level2ROISum += level2ROI;
      }
    }
    this.level2ROI = level2ROISum;
    await this.save();
    }

}
return this.level2ROI
    
  } catch (error) {
    next(error)
    
  }
  
  
  
};


userSchema.methods.calculateLevel3ROI = async function () {
  try {
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
          reportName:"level3ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level3ROI,
          percentage:1
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
          reportName:"level3ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level3ROI,
          percentage:packageData.stage3
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
          reportName:"level3ROIReport",
          userID: user.ownSponserId,
          name: user.username,
          dayROI: user.dailyROI,
          capitalAmount: user.packageAmount,
          LevelAmountCredited: level3ROI,
          percentage:packageData.stage3
        });
  
        await this.save();
        level3ROISum += level3ROI;
      }
    }
    this.level3ROI = level3ROISum;
    await this.save();
    }

}
return this.level3ROI
    
  } catch (error) {
    next(error)
    
  }
  
  
  
};



const User=mongoose.model("User",userSchema);

export default User;



