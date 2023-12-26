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
      sponserID: String,
      name: String,
      amount: Number,
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
    },
    packageChosen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
    },
    userStatus: {
        type: String,
        enum: ["pending", "readyToApprove", "approved"],
      },
      transactions: [transactionSchema],
      bankDetails: {
        holderName: String,
        accountNum: String,
        ifscCode: String,
        bank: String,
        aadhar: String,
        pan: String,
        aadharPhoto: String,
        panPhoto: String,
      },
      allTransactions: [allTransactionSchema],
      myChilds:[{type:mongoose.Schema.Types.ObjectId,
        ref:"User"}]
},{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;