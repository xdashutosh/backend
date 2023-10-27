import express from 'express';
import { createCourses, getAllCourses } from '../controllers/courseController.js';


const router = express.Router();

router.route("/courses").get(getAllCourses);
router.route("/createcourse").post(createCourses);



export default router;