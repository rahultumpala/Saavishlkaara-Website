const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const path = require("path")
const blogController = require("./blogController")

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

exports.getAuthPage = catchAsync(async (req, res, next) => {
    res.status(200).render("auth-page");
});

exports.getUserProfilePage = catchAsync(async (req, res, next) => {
    res.status(200).render("profile-page", {
        user: req.user
    })
})

exports.getNewBlogPostPage = catchAsync(async (req, res, next) => {
    res.status(200).render("new-blog-post", {
        user: req.user
    })
})


exports.getMyBlogsPage = catchAsync(async (req, res, next) => {

    await blogController.getBlogsOfUser(req.user, res);
    let noBlogs = false;
    if (res.locals.blogs == "None" || res.locals.blogs == undefined || res.locals.blogs.length == 0) {
        noBlogs = true;
    }
    res.status(200).render("my-blogs", {    
        user: req.user,
        noBlogs,
        blogs: res.locals.blogs,
    })
})


