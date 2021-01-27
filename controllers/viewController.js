const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const path = require("path")

exports.getHomepage = catchAsync(async (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../views/index.html'))
})

exports.getBlogPage = catchAsync(async (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, "../views/blog.html"))
})

exports.getCoursesPage = catchAsync(async (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, "../views/courses.html"))
})

exports.getAboutPage = catchAsync(async (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, "../views/about.html"))
})

exports.getTeamPage = catchAsync(async (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, "../views/our-team.html"))
})

exports.getContactPage = catchAsync(async (req, res, next) => {
    res.status(200).render("contact");
});

exports.getCampusAmbassadorsPage = catchAsync(async (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, "../views/campus-ambassadors.html"))
})