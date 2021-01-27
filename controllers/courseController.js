const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const CourseModel = require('../models/CourseModel');

exports.createCourse = catchAsync(async (req, res, next) => {
    const newCourse = await CourseModel.create({ ...req.body });
    newCourse.id = undefined;
    res.status(200).json(newCourse);
})

exports.getCourses = catchAsync(async (req, res, next) => {
    const courses = await CourseModel.find();
    res.status(200).json(courses);
})