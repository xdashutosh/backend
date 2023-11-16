import  jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";


export const isAuthenticated = catchAsyncError(
async (req,res,next)=>{
const {token} = req.cookies;

if(!token) return next(new ErrorHandler("not authenticated",401));

const decoded = jwt.verify(token,process.env.JWT_SECRET);

req.user = await User.findById(decoded._id);

next();
});

export const authadmin = (req,res,next) => {
if(req.user.role!=="admin") return next(new ErrorHandler("not an Admin! not allowed",403));
next();
};

export const isSubscribed = (req,res,next) => {
    if(req.user.subscription.status!=="active" && req.user.role!=="admin") return next(new ErrorHandler("not a subscriber! not allowed",403));
    next();
    };

