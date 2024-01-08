import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
    minAmount: {
      type: Number,
      required: true,
    },
    maxAmount: {
      type: Number,
      required: true,
    },
    minMembers: {
      type: Number,
      required: true,
    },
    stage1: {
      type: Number,
      required: true,
    },
    stage2: {
      type: Number,
      required: true,
    },
    stage3: {
      type: Number,
      required: true,
    },
    PackageUsed:[
      {type:mongoose.Schema.Types.ObjectId,
        ref:"User"}
    ]
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
