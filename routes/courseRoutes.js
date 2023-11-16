import express from 'express';
import { addLecture, createCourses, deleteCourse, deleteLecture, getAllCourses, getCourseLecture } from '../controllers/courseController.js';
import singleUpload from '../middlewares/multer.js';
import { authadmin, isAuthenticated, isSubscribed } from '../middlewares/auth.js';


const router = express.Router();

router.route("/courses").get(getAllCourses);
router.route("/createcourse").post(isAuthenticated,authadmin,singleUpload,createCourses);
router.route("/course/:id").get(isAuthenticated,isSubscribed,getCourseLecture).post(isAuthenticated,authadmin,singleUpload,addLecture);
router.route("/course/:id").delete(isAuthenticated,deleteCourse);

router.route("/lecture").delete(isAuthenticated,authadmin,singleUpload,deleteLecture);






export default router;