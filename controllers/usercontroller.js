import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
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

  if (!name || !email || !password)
    return next(new ErrorHandler("please enter all required fields", 400));

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User already exists", 409));

  //upload file on cloudinary

  user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: "temp", url: "tempurl" },
  });

  sendtoken(res, user, "Registerd successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // const file = req.file

  if (!email || !password)
    return next(new ErrorHandler("please enter all required fields", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User does not exists", 401));

  const isMatched = await user.comparePassword(password);
  if (!isMatched)
    return next(new ErrorHandler("incorrect email or password", 409));

  //upload file on cloudinary

  sendtoken(res, user, `login successfully ${user.name} `, 201);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "logout successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    user,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("please enter all required fields", 400));

  const user = await User.findById(req.user._id).select("+password");
  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) return next(new ErrorHandler("incorrect old password", 400));

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "password changed succesfully!",
  });
});

export const updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();
  res.json({
    success: true,
    message: "Profile uploaded succesfully!",
  });
};

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  //cloudinary TODO

  res.json({ success: true, message: "profile picture updated succesfully!" });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 400));
  const resetToken = await user.getresetToken();
  await user.save();
  //send token via email
  const url = `${process.env.FRONTEND_URL}/api/v1/resetpassword/${resetToken}`;
  sendEmail(
    user.email,
    "Eduorage Reset Password",
    `click on the link to reset password ${url}. if you have not requested then please ignore `
  );

  res.json({
    success: true,
    message: `Reset token has been sent to ${user.email}`,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const ResetPasswordToken = token;
  const user = await User.findOne({
    ResetPasswordToken,
    ResetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) return next(new ErrorHandler("Invalid or expired", 400));
  user.password = req.body.password;
  user.ResetPasswordToken = undefined;
  user.ResetPasswordExpire = undefined;
  await user.save();
  res.json({
    success: true,
    message: "your password has been reset successfully",
  });
});
