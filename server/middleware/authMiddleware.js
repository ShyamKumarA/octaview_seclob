import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler"
import { errorHandler } from "./errorHandler.js";

export const protectUser = asyncHandler(async (req, res, next) => {

  let token;
  
  if (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
  ) {
    try {

      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
        // console.log(req.user);
      next();

    } catch (error) {
        next(error);
    }
  }

  if (!token) {
    return next(errorHandler(401,'Not authenticated, No token'))
  }
  
});
