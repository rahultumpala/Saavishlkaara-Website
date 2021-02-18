const BlogModel = require("../models/blog-model");
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")
const slugify = require("slugify")

function convertDataToHtml(blocks) {
    var convertedHtml = "";
    blocks.map(block => {

        switch (block.type) {
            case "header":
                convertedHtml += `h${block.data.level}\n|\t${block.data.text}`;
                break;
            case "embded":
                convertedHtml += `div\n\tiframe(width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen)`;
                break;
            case "paragraph":
                convertedHtml += `p\t${block.data.text}`;
                break;
            case "delimiter":
                convertedHtml += "hr";
                break;
            case "image":
                convertedHtml += `img(class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}")\nbr\nem\n|\t${block.data.caption}`;
                break;
            case "list":
                convertedHtml += "ul\n\t";
                block.data.items.forEach(function (li) {
                    convertedHtml += `li\t${li}`;
                });
                break;
            default:
                console.log("Unknown block type", block.type);
                break;
        }
    });
    return convertedHtml;
}

function create(status, req) {
    let foundHeader = false;
    let foundBlog = false;
    let slug = "";
    let firstPara = "";
    let title = "";
    req.body.blocks.forEach((el) => {
        if (el.type == "header" && !foundHeader) {
            slug = slugify(el.data.text).toLowerCase();
            title = el.data.text
        }
        if (el.type == "paragraph" && !foundBlog) {
            firstPara = el.data.text
        }
    })
    const data = {
        content: JSON.stringify(req.body.blocks),
        createdAt: req.requestTime,
        createdBy: req.user._id,
        readingTime: req.body.readingTime,
        tags: req.body.tags,
        status,
        slug,
        title,
        firstPara,
    }
    return data;
}

exports.saveArticle = catchAsync(async (req, res, next) => {
    const data = create("save", req)
    const blog = await BlogModel.create({ ...data });
    if (blog) {
        res.status(200).json({ status: "success" })
    } else {
        throw new AppError("Error Creating a blog entry", 500)
    }
})


exports.publishArticle = catchAsync(async (req, res, next) => {
    const data = create("publish", req)
    const blog = await BlogModel.create({ ...data });
    if (blog) {
        res.status(200).json({ status: "success" })
    } else {
        throw new AppError("Error Creating a blog entry", 500)
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
        console.log('Error while fetching user Blogs')
        console.log(error)
    }
}