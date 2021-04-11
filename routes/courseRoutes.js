const express = require('express');
const router = express.Router();
const courseController = require("../controllers/courseController");

router.route("/").post(courseController.uploadQrImage, courseController.createCourse);

module.exports = router;