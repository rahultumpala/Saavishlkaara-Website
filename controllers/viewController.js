const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const path = require("path")

exports.getContactPage = catchAsync(async (req, res, next) => {
    res.status(200).render('contact');
})

exports.getHomepage = catchAsync(async (req,res,next) => {
    res.status(200).sendFile(path.join(__dirname ,'../views/index.html'))
})