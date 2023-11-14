import express from 'express';
import {  addToPlaylist, changePassword,   deleteMyProfile,   deleteUser,   forgotPassword,  getAllUsers,  getMyProfile, login, logout, register, removeFromPlaylist, resetPassword,updateProfile, updateProfilePicture, updateRole } from '../controllers/usercontroller.js';
import { authadmin, isAuthenticated } from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';
const router = express.Router();

//register
router.route("/register").post(singleUpload,register);

//login
router.route("/login").post(login);



//logout
router.route("/logout").get(logout);

//get my profile
router.route("/me").get(isAuthenticated,getMyProfile).delete(isAuthenticated,deleteMyProfile);



//change password
router.route("/changepassword").put(isAuthenticated,changePassword);
 

//update profile
router.route("/updateprofile").put(isAuthenticated,updateProfile);

//update profile picture
router.route("/updateprofilepicture").put(singleUpload,isAuthenticated,updateProfilePicture);



//forget password 
router.route("/forgotpassword").post(forgotPassword);


//Reset password
router.route("/resetpassword/:token").put(resetPassword);


//addtoplaylist
router.route("/addtoplaylist").post(isAuthenticated,addToPlaylist);



//removefromplaylist
router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist);


router.route("/admin/users").get(isAuthenticated,authadmin,getAllUsers);
router.route("/admin/users/:id").put(isAuthenticated,authadmin,updateRole).delete(isAuthenticated,authadmin,deleteUser);


export default router;