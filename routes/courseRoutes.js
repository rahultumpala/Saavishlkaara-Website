const express = require('express');
const router = express.Router();
const courseController = require("../controller/courseController");

router.route("/courses").post(courseController.createCourse).get(courseController.getCourses);

module.exports = router;