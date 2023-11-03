import express from 'express';
import { changePassword,  forgotPassword,  getMyProfile, login, logout, register, resetPassword, updateProfile, updateProfilePicture } from '../controllers/usercontroller.js';
import { isAuthenticated } from '../middlewares/auth.js';
const router = express.Router();

//register
router.route("/register").post(register);

//login
router.route("/login").post(login);



//logout
router.route("/logout").get(logout);

//get my profile
router.route("/me").get(isAuthenticated,getMyProfile);



//change password
router.route("/changepassword").put(isAuthenticated,changePassword);
 

//update profile
router.route("/updateprofile").put(isAuthenticated,updateProfile);

//update profile picture
router.route("/updateprofilepicture").put(isAuthenticated,updateProfilePicture);



//forget password 
router.route("/forgotpassword").post(forgotPassword);


//Reset password
router.route("/resetpassword/:token").put(resetPassword);


//addtoplaylist
//removefromplaylist

export default router;