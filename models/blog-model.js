const mongoose = require('mongoose')
const slugify = require('slugify')

const blogSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        required: [true, "A blog must have a date created"]
    },
    createdBy: {
        type: mongoose.ObjectId,
        required: [true, "A blog must have a created User"],
    },
    readingTime: {
        type: String,
        // required: [true, "A blog post must have a specified reading time"]
    },
    tags: {
        type: [String],
        // required: [true, "A blog post must have specified tags"]
    },
    content: {
        type: String,
        required: [true, "A blog post must have a valid content"]
    },
    images: {
        type: [String],
    },
    status: {
        type: String,
        enum: ['save', 'publish'],
        default: 'save'
    },
    slug: {
        type: String,
        unique: true,
    },
    firstPara: {
        type: String,
    },
    title: {
        type: String
    }
});

const Model = new mongoose.model("blog", blogSchema);
module.exports = Model;