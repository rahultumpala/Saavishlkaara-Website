const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const CourseModel = require('../models/course-model');
const mkdirp = require('mkdirp');
const slugify = require('slugify');
const multer = require('multer');
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const fileFilterForImages = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new AppError("File not an Image. Please upload only Images!", 400))
    }
}

const uploadImage = multer({
    storage: multerStorage,
    fileFilter: fileFilterForImages
})

exports.uploadQrImage = uploadImage.single("qr-image")

exports.createCourse = catchAsync(async (req, res, next) => {
    const slug = slugify(req.body.name.toLowerCase());
    // const qrImgName = `${slug}.jpeg`;
    // create directory if it doesn't exist & ignore if exists
    // --
    // await mkdirp("qr_images_data/");
    // --
    // upload image into req.file.buffer
    // resize and store it in the file system
    // --
    // console.log(req.files);
    // sharp(req.file.buffer).resize(650, 500).toFormat("jpeg").jpeg({ quality: 90 })
    //     .toFile(`qr_images_data/${qrImgName}`);
    // --
    // create new course
    const newCourse = await CourseModel.create({ ...req.body, slug });
    if (newCourse)
        res.status(200).json({ status: "success" });
    else {
        throw new AppError("Something went wrong while creating course", 500);
    }
})

exports.getCourses = async function () {
    const courses = await CourseModel.find();
    return courses;
}
