const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        required: [true, "A blog must have a date created"]
    },
    createdBy: {
        type: ObjectId,
        required: [true, "A blog must have a created User"],
    },
    readingTime: {
        type: String,
        required: [true, "A blog post must have a specified reading time"]
    },
    title: {
        type: String,
        required: [true, "A blog post must have a title"]
    },
    tags: {
        type: [String],
        required: [true, "A blog post must have specified tags"]
    },
    tagline: {
        type: String,
        required: [true, "A blog post must have a tag line"]
    },
    content: {
        type: String,
        required: [true, "A blog post must have a valid content"]
    },
    images: {
        type: [String],
    }
});

const model = new mongoose.Model("Blogs_model", blogSchema);
module.exports = model;