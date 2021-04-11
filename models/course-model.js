const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "A course must have a valid name"],
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
    },
    tutor: {
        type: mongoose.Schema.ObjectId,
        required: [true, "A course must have a valid Tutor"],
    },
    duration: {
        type: String,
        required: [true, "A course must have a valid Duration"],
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
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
    qrPath: {
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
    isPublic: {
        type: Boolean,
        required: [true, "A course must be specified as active or not for enrolling"]
    },
    regnLink: {
        type: String,
        required: [true, "A course must have a valid registration link"],
    },
});

courseSchema.pre("save", async function (next) {
    this.qrPath = "/qr_images_data/payment_qr.jpg";
    next();
});

const Model = new mongoose.model("courses", courseSchema);
module.exports = Model;