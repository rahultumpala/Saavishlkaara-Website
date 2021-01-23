const mongoose = require('mongoose');
const UserModel = require('./UserModel');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "A course must have a valid name"],
    },
    tutor: {
        type: mongoose.Schema.ObjectId,
        required: [true, "A course must have a valid Tutor"],
    },
    duration: {
        type: String,
        required: [true, "A course must have a valid Duration"],
    },
    description: {
        type: String,
        required: [true, "A course must have a valid Description"],
    },
    learningObjectives: {
        type: String,
        required: [true, "A course must have a valid Learning Objectives"]
    },
    prerequisites: {
        type: String,
    },
    certificateOnCompletion: {
        type: Boolean,
        default: true,
    },
    resources: {
        // will probaly host in our own server or point to a google drive/dropbox link
        type: String
    },
    tags: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    price: {
        type: String,
        required: [true, "A course must have a valid Price"],
    },
    isActive: {
        type: Boolean,
        required: [true, "A course must be specified as active or not for enrolling"]
    }
});

module.exports = courseSchema;