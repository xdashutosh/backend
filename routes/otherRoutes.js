import express from 'express';
import { contactus, courseReq, dashstats } from '../controllers/othercontroller.js';
import { authadmin, isAuthenticated } from '../middlewares/auth.js';
const router = express.Router();


router.route('/contact').post(contactus); 
router.route('/requestcourse').post(courseReq); 

//get admin dashboard stats
router.route('/admin/stats').post(isAuthenticated,authadmin,dashstats); 



export default router;