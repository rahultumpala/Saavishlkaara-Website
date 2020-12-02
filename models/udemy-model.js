const mongoose = require("mongoose");
const courseSchema = require("./courseSchema");

const udemySchema = mongoose.Schema({
    courseDetails: courseSchema,
    maxStudents: {
        type: Number,
    },
    udemyCourseLink: {
        type: String,
        required: [true, "A Udemy course must have a valid Udemy reference link"]
    },
    lectures: {
        type: Number,
        required: [true, "A Udemy course must have a valid number of lectures"],
    },
});

const UdemyModel = mongoose.model("Udemy_Model", udemySchema);
module.exports = UdemyModel;