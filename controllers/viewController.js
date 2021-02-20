const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const path = require("path")
const blogController = require("./blogController")

exports.getHomepage = catchAsync(async (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../views/index.html'))
})

exports.getBlogsPage = catchAsync(async (req, res, next) => {
    await blogController.getAllPublishedBlogs(res);
    res.status(200).render("blog", {
        user: req.user,
        noBlogs: false,
        blogs: res.locals.blogs,
    })
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


exports.getMySingleBlog = catchAsync(async (req, res, next) => {
    const { viewType, saveType, slug } = req.params;
    await blogController.getSingleBlog(req.user, slug, res);
    let noBlog = false;
    if (res.locals.singleBlog == "None" || res.locals.singleBlog == undefined || res.locals.singleBlog.length == 0) {
        noBlog = true;
    }
    if (viewType == "edit") {
        res.status(200).render("new-blog-post", {
            user: req.user,
            editBlog: true,
            blogContent: res.locals.singleBlog.content,
            noBlog,
            blogId: res.locals.singleBlog._id
        })
    } if (viewType == "view") {
        await blogController.viewSingleBlog(req.params.slug, res);
        res.status(200).render("one-blog", {
            blogContent: res.locals.singleBlogContentInPug,
            noBlog,
            blog: res.locals.singleBlog,
            user: req.user,
        })
    }
})


exports.viewSingleBlogPage = catchAsync(async (req, res, next) => {
    await blogController.viewSingleBlog(req.params.slug, res);
    let noBlog = false;
    if (res.locals.singleBlog == "None" || res.locals.singleBlog == undefined || res.locals.singleBlog.length == 0) {
        noBlog = true;
    }
    res.status(200).render("one-blog", {
        blogContent: res.locals.singleBlogContentInPug,
        noBlog,
        blog: res.locals.singleBlog,
        user: req.user,
    })
})