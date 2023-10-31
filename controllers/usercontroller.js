import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendtoken } from "../utils/sendtoken.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
};

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  // const file = req.file

//   if (!name || !email || !password)
//     return next(new ErrorHandler("please enter all required fields", 400));

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User already exists", 409));

  //upload file on cloudinary

  user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: "temp", url: "tempurl" },

  });


  sendtoken(res,user,"Registerd successfully",201);
});
