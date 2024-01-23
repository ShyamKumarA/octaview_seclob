import { errorHandler } from "../middleware/errorHandler.js";
import User from "../models/userModel.js";


//direct income report
export const directIncomeReport=async(req,res,next)=>{
    const userId = req.user._id;
  try {
    const userData = await User.findById(userId).populate("referalHistory")
    if (userData) {
      const directIncome=userData.referalHistory
      console.log(directIncome);
      //.select("username email phone walletWithdrawStatus walletWithdrawAmount");
      res.status(200).json({
        directIncome,
        sts: "01",
        msg: "get direct income report users Success",
      });
    } else {
      return next(errorHandler(401, "User Login Failed"));
    }
  } catch (error) {
    next(error);
  }
}

export const level1IncomeReport=async(req,res,next)=>{
    const userId = req.user._id;
  try {
    const userData = await User.findById(userId).populate("level1ROIHistory")
    if (userData) {
      const level1Income=userData.level1ROIHistory
      //.select("username email phone walletWithdrawStatus walletWithdrawAmount");
      res.status(200).json({
        level1Income,
        sts: "01",
        msg: "get level 1 ROI income report users Success",
      });
    } else {
      return next(errorHandler(401, "User Login Failed"));
    }
  } catch (error) {
    next(error);
  }
}

export const level2IncomeReport=async(req,res,next)=>{
    const userId = req.user._id;
  try {
    const userData = await User.findById(userId).populate("level2ROIHistory")
    if (userData) {
      const level2Income=userData.level2ROIHistory
      //.select("username email phone walletWithdrawStatus walletWithdrawAmount");
      res.status(200).json({
        level2Income,
        sts: "01",
        msg: "get level 1 ROI income report users Success",
      });
    } else {
      return next(errorHandler(401, "User Login Failed"));
    }
  } catch (error) {
    next(error);
  }
}

export const level3IncomeReport=async(req,res,next)=>{
    const userId = req.user._id;
  try {
    const userData = await User.findById(userId).populate("level3ROIHistory")
    if (userData) {
      const level3Income=userData.level3ROIHistory
      //.select("username email phone walletWithdrawStatus walletWithdrawAmount");
      res.status(200).json({
        level3Income,
        sts: "01",
        msg: "get level 1 ROI income report users Success",
      });
    } else {
      return next(errorHandler(401, "User Login Failed"));
    }
  } catch (error) {
    next(error);
  }
}


//daily ROI report

export const dailyROIReport=async(req,res,next)=>{
    const userId = req.user._id;
  try {
    const userData = await User.findById(userId).populate("dailyROIHistory")
    if (userData) {
      const dailyROIHistory=userData.dailyROIHistory
      //.select("username email phone walletWithdrawStatus walletWithdrawAmount");
      res.status(200).json({
        dailyROIHistory,
        sts: "01",
        msg: "get level 1 ROI income report users Success",
      });
    } else {
      return next(errorHandler(401, "User Login Failed"));
    }
  } catch (error) {
    next(error);
  }
}


//Wallet withdraw report

export const walletWithdrawReport=async(req,res,next)=>{
    const userId = req.user._id;
  try {
    const userData = await User.findById(userId).populate("walletWithdrawHistory")
    if (userData) {
      const walletWithdrawHistory=userData.walletWithdrawHistory
      //.select("username email phone walletWithdrawStatus walletWithdrawAmount");
      res.status(200).json({
        walletWithdrawHistory,
        walletAmount:userData.walletAmount,
        totalRefferalAmount:userData.referalIncome,
        totalDailyBonus:userData.dailyROI,
        sts: "01",
        msg: "get wallet withdrawal report users Success",
      });
    } else {
      return next(errorHandler(401, "User Login Failed"));
    }
  } catch (error) {
    next(error);
  }
}

//fund add history
export const addFundHistory=async(req,res,next)=>{
  const userId = req.user._id;
try {
  const userData = await User.findById(userId).populate("addFundHistory")
  if (userData) {
    const addFundHistory=userData.addFundHistory
    //.select("username email phone walletWithdrawStatus walletWithdrawAmount");
    res.status(200).json({
      addFundHistory,
      packagename:userData.packageName,
      totalCapitalAmount:userData.packageAmount,
      sts: "01",
      msg: "get wallet withdrawal report users Success",
    });
  } else {
    return next(errorHandler(401, "User Login Failed"));
  }
} catch (error) {
  next(error);
}
} 


//capital withdraw report

export const capitalWithdrawReport=async(req,res,next)=>{
    const userId = req.user._id;
  try {
    const userData = await User.findById(userId).populate("capitalWithdrawHistory")
    if (userData) {
      const capitalWithdrawHistory=userData.capitalWithdrawHistory
      //.select("username email phone walletWithdrawStatus walletWithdrawAmount");
      res.status(200).json({
        capitalWithdrawHistory,
        totalCapitalAmount:userData.packageAmount,
        sts: "01",
        msg: "get wallet withdrawal report users Success",
      });
    } else {
      return next(errorHandler(401, "User Login Failed"));
    }
  } catch (error) {
    next(error);
  }
}