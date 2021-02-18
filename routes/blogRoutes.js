const express = require('express')
const router = express.Router();
const blogController = require("../controllers/blogController")
const authController = require("../controllers/authController")

router.route("/save").post(authController.protect, blogController.saveArticle).get(authController.protect, blogController.getSavedArticles)
router.route("/publish").post(authController.protect, blogController.publishArticle).get(authController.protect, blogController.getPublishedArticles)

module.exports = router;