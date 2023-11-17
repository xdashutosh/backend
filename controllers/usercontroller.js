import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendtoken } from "../utils/sendtoken.js";
import { Course } from "../models/Course.js";
import getDatauri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import { Stats } from "../models/Stats.js";



export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return next(new ErrorHandler("please enter all required fields", 400));

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User already exists", 409));

  //upload file on cloudinary
  const file = req.file;
  const fileuri = getDatauri(file);
  const mycloud  = await cloudinary.v2.uploader.upload(fileuri.content);

  user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: mycloud.public_id, url: mycloud.secure_url },
  });

  sendtoken(res, user, "Registerd successfully", 201);
});


export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;


  if (!email || !password)
    return next(new ErrorHandler("please enter all required fields", 400));

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("User does not exists", 401));

  const isMatched = await user.comparePassword(password);

  if (!isMatched)
    return next(new ErrorHandler("incorrect email or password", 409));



  sendtoken(res, user, `login successfully ${user.name} `, 201);
});



export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      secure:true,
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
  const user = await User.findById(req.user._id);
  if(!user) return next(new ErrorHandler("User not found",403));


  const file = req.file;
  const fileuri = getDatauri(file);
  const mycloud  = await cloudinary.v2.uploader.upload(fileuri.content);
await cloudinary.v2.uploader.destroy(user.avatar.public_id);

user.avatar = {
  public_id:mycloud.public_id,
  url:mycloud.secure_url
}
await user.save();
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


export const addToPlaylist = catchAsyncError(async (req, res, next) => {
const {id} =req.body
  const user = await User.findById(req.user._id);
const course = await Course.findById(id);

if(!course) return next(new ErrorHandler("Course not found",404));
const itemExit = user.playlist.find((item)=>{
  if(item.course.toString()===course._id.toString()){return true}
  else{return false}
})

if(itemExit) return next(new ErrorHandler("Item already present",409));


user.playlist.push({
  course:course._id,
  poster:course.poster.url
});

  await user.save();
  res.json({
    success:true,
    message:"added to Playlist successfully"
  });


});

export const removeFromPlaylist = catchAsyncError(async(req,res,next)=>{

 
  const user = await User.findById(req.user._id);
const course = await Course.findById(req.query.id);

if(!course) return next(new ErrorHandler("Course not found",404));

const newPlaylist = user.playlist.filter((item)=>{
if(item.course.toString()!== course._id.toString()) return item;
});

user.playlist = newPlaylist;
  await user.save();
  res.json({
    success:true,
    message:"Removed from Playlist successfully"
  });

});



export const getAllUsers = async (req, res) => {
  const users = await User.find({});
    res.status(200).json({
      success: true,
    users,
    });
  };


  export const updateRole = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return next(new ErrorHandler("user not found",404));

    if (user.role === "admin") {
      user.role = "user";
    }
    else{
      user.role = "admin";

    }

    await user.save();
      res.status(200).json({
        success: true,
      message:`Role is updated to ${user.role}`
      });
    };


    export const deleteUser = async (req, res) => {
      const user = await User.findById(req.params.id);
      if(!user) return next(new ErrorHandler("user not found",404));

await cloudinary.v2.uploader.destroy(user.avatar.public_id);
   
//cancel subscription

      await user.deleteOne();
        res.status(200).json({
          success: true,
        message:`user deleted successfully`
        });
      };


      export const deleteMyProfile = async (req, res) => {
        const user = await User.findById(req.user._id);
        if(!user) return next(new ErrorHandler("user not found",404));
  
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
     
  //cancel subscription
  
        await user.deleteOne();
          res.status(200).cookie("token",null,{
            expires:new Date(Date.now())
          }).json({
            success: true,
          message:`Account deleted successfully`
          });
        };



      User.watch().on("change",async()=>{
        const stats = await Stats.find({}).sort({createdAt:"desc"}).limit(1);
        const subscription = await User.find({"subscription.status":"active"});
        stats[0].users = await User.countDocuments();
        stats[0].subscriptions = subscription.length;
        stats[0].createdAt = new Date(Date.now());
         console.log(stats);
        await stats[0].save();
      });


      Course.watch().on("change",async()=>{
        try {
          const stats = await Stats.find({}).sort({createdAt:"desc"}).limit(1);
          const courses = await Course.find({});
          console.log("course chnaged!");
  
         let totalviews =0;
         for(let i = 0; i < courses.length; i)
         {
          totalviews+=courses[i].views;
         }
         stats[0].views = totalviews;
         stats[0].createdAt = new Date(Date.now());
  
         await stats[0].save();  
  
          
        } catch (error) {
          console.log(err);
        }
       
      });