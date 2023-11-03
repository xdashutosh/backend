import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import ErrorHandler from "../utils/errorHandler.js";
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
  // const file = req.file;
  await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: "temp",
      url: "temp",
    },
  });
  res.status(201).json({
    success: true,
    message: "Course created successfully.You can add lectures now",
  });
});
