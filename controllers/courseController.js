import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import getDatauri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";
export const getAllCourses = catchAsyncError(async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).json({
    success: true,
    courses,
  });
});

export const createCourses = catchAsyncError(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;
  if (!title || !description || !category || !createdBy)
    return next(new ErrorHandler("Please add all fields", 400));
  const file = req.file;


const fileuri =  getDatauri(file);
const mycloud  = await cloudinary.v2.uploader.upload(fileuri.content);

  await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id:mycloud.public_id,
      url:mycloud.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Course created successfully.You can add lectures now",
  });
});

export const getCourseLecture = catchAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if(!course) return next(new ErrorHandler("course not found",404));

course.views+=1;
await course.save();
  res.status(200).json({
    success: true,
    lectures:course.lectures
  });
});

//max video size 100mb
export const addLecture = catchAsyncError(async (req, res, next) => {
  const {title,description} = req.body;
  const {id} = req.params;
  const course = await Course.findById(id);
  
  if(!course) return next(new ErrorHandler("course not found",404));
  const file = req.file;
  const fileuri =  getDatauri(file);
const mycloud  = await cloudinary.v2.uploader.upload(fileuri.content,{
  resource_type:"video"
});

  //upload file here

  course.lectures.push({
    title,description,video:{
      public_id:mycloud.public_id,
      url:mycloud.secure_url
    }
  })

  course.numOfVideos = course.lectures.length;

await course.save();
  res.status(200).json({
    success: true,
  message:"lecture added"
  });
});



export const deleteCourse = catchAsyncError(async (req, res, next) => {
  const {id} = req.params;
  const course = await Course.findById(id);
  
  if(!course) return next(new ErrorHandler("course not found",404));
await cloudinary.v2.uploader.destroy(course.poster.public_id);
for (let index = 0; index < course.lectures.length; index++) {

  const singlelec = course.lectures[index];
  
  await cloudinary.v2.uploader.destroy(singlelec.video.public_id,{resource_type:"video"});
  
}
 await course.deleteOne();
  res.status(200).json({
    success: true,
  message:"course deleted successfully"
  });
});



export const deleteLecture = catchAsyncError(async (req, res, next) => {
  const {courseId,lectureId} = req.query.id;
  const course = await Course.findById(courseId);
  if(!course) return next(new ErrorHandler("course not found",404));
  

const lecture = course.lectures = course.lectures.find((item)=>{
  if(item._id.toString()===lectureId.toString()) return item;
  
  });
  await cloudinary.v2.uploader.destroy(lecture.video.public_id,{resource_type:"video"});

course.lectures = course.lectures.filter((item)=>{
if(item._id.toString()!==lectureId.toString()) return item;
});

course.numOfVideos = course.lectures.length;
await course.save();
  res.status(200).json({
    success: true,
  message:"Lecture deleted successfully"
  });
});