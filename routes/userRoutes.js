import express from 'express';
import { register } from '../controllers/usercontroller.js';
const router = express.Router();

//register
router.route("/register").post(register);

//login


//logout

//get my profile



//change password


//update profile

//update profile picture

//forget password 
//Reset password


//addtoplaylist
//removefromplaylist

export default router;