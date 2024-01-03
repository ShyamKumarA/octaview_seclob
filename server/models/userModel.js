import mongoose from 'mongoose'

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
    earning: {
        type: Number,
        default: 0,
    },
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



const User=mongoose.model("User",userSchema);

export default User;