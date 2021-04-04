const BlogModel = require("../models/blog-model");
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const slugify = require("slugify")

function convertDataToHtml(blocks) {
    var convertedHtml = "";
    blocks.map(block => {
        switch (block.type) {
            case "header":
                convertedHtml += `\n<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                break;
            case "embded":
                convertedHtml += `\n<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
                break;
            case "paragraph":
                convertedHtml += `\n<p>${block.data.text}</p>`;
                break;
            case "delimiter":
                convertedHtml += "\n<hr />";
                break;
            case "image":
                convertedHtml += `\n<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
                break;
            case "list":
                convertedHtml += "<ul>";
                block.data.items.forEach(function (li) {
                    convertedHtml += `\n<li>${li}</li>`;
                });
                convertedHtml += "</ul>";
                break;
            default:
                console.log("Unknown block type", block.type);
                break;
        }
    });
    return convertedHtml;
}

function create(status, req, modified) {
    let foundHeader = false;
    let foundBlog = false;
    let slug = "";
    let firstPara = "";
    let title = "";
    req.body.data.blocks.forEach((el) => {
        if (el.type == "header" && !foundHeader) {
            slug = slugify(el.data.text).toLowerCase();
            title = el.data.text
        }
        if (el.type == "paragraph" && !foundBlog) {
            firstPara = el.data.text
        }
    })
    let data;
    if (modified) {
        data = {
            content: req.body.data.blocks,
            readingTime: req.body.readingTime,
            tags: req.body.tags,
            slug,
            title,
            firstPara,
            hasModified: true,
            modifiedAt: Date.now(),
            blogId: req.body.blogId,
            status,
        }
    } else {
        data = {
            content: req.body.data.blocks,
            createdAt: req.requestTime,
            createdBy: req.user._id,
            readingTime: req.body.readingTime,
            tags: req.body.tags,
            status,
            slug,
            title,
            firstPara,
        }
    }
    return data;
}

exports.saveArticle = catchAsync(async (req, res, next) => {
    if (req.body.hasModified) {
        req.blogData = create("save", req, true)
        this.modifyArticle(req, res, next)
    } else {
        const data = create("save", req, false)
        const blog = await BlogModel.create({ ...data });
        if (blog) {
            res.status(200).json({ status: "success" })
        } else {
            throw new AppError("Error Creating a blog entry", 500)
        }
    }
})

exports.modifyArticle = catchAsync(async (req, res, next) => {
    const blog = await BlogModel.findByIdAndUpdate(req.body.blogId, { ...req.blogData })
    if (blog) {
        res.status(200).json({ status: "success" })
    } else {
        throw new AppError("Error Modifying a blog entry", 500)
    }
})

exports.publishArticle = catchAsync(async (req, res, next) => {
    if (req.body.hasModified) {
        req.blogData = create("publish", req, true)
        this.modifyArticle(req, res, next);
    } else {
        const data = create("publish", req, false)
        const blog = await BlogModel.create({ ...data });
        if (blog) {
            res.status(200).json({ status: "success" })
        } else {
            throw new AppError("Error Creating a blog entry", 500)
        }
    }
})

exports.getSavedArticles = catchAsync(async (req, res, next) => {
    const blogs = await BlogModel.find({ createdBy: req.user._id, status: 'save' })
    res.status(200).json({ status: "success", blogs })
})

exports.getPublishedArticles = catchAsync(async (req, res, next) => {
    const blogs = await BlogModel.find({ createdBy: req.user._id, status: 'publish' })
    res.status(200).json({ status: "success", blogs })
})


exports.getBlogsOfUser = async (user, res) => {
    try {
        const blogs = await BlogModel.find({ createdBy: user._id });
        if (blogs) {
            res.locals.blogs = blogs;
        } else {
            res.locals.blogs = "None"
        }
    } catch (error) {
        console.error('Error while fetching user Blogs')
        console.error(error);
    }
}

exports.getSingleBlog = async (user, slug, res) => {
    try {
        const blog = await BlogModel.findOne({ createdBy: user._id, slug });
        if (blog) {
            res.locals.singleBlog = blog;
        } else {
            res.locals.singleBlog = "None"
        }
    } catch (error) {
        console.error('Error while fetching user Blog')
        console.error(error)
    }
}

exports.viewSingleBlog = async (slug, res) => {
    try {
        const blog = await BlogModel.findOne({ slug });
        if (blog) {
            res.locals.singleBlogContentInPug = convertDataToHtml(blog.content)
            res.locals.singleBlog = blog;
        } else {
            res.locals.singleBlog = "None"
        }
    } catch (error) {
        console.error('Error while fetching user Blog')
        console.error(error)
    }
}

exports.getAllPublishedBlogs = async (res) => {
    try {
        const blogs = await BlogModel.find({ status: 'publish' }).populate("createdBy", "firstName lastName");
        if (blogs) {
            res.locals.blogs = blogs;
        } else {
            res.locals.blogs = "None"
        }
    } catch (error) {
        console.error('Error while fetching user Blog')
        console.error(error)
    }
}