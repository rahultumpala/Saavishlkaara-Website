const express = require("express");
const viewController = require("../controllers/viewController")
const authController = require("../controllers/authController")
const router = express.Router();

router.route("/our-team").get(viewController.getTeamPage);
router.get("/", viewController.getHomepage)
router.route("/contact").get(viewController.getContactPage);
router.route("/about").get(viewController.getAboutPage);
router.route("/blog").get(viewController.getBlogsPage);
router.route("/blog/:slug").get(viewController.viewSingleBlogPage);
router.route("/courses").get(viewController.getCoursesPage);
router.route("/campus-ambassadors").get(viewController.getCampusAmbassadorsPage);
router.route("/campus-ambassadors").get(viewController.getCampusAmbassadorsPage);
router.route("/auth").get(viewController.getAuthPage);
router.route("/user-profile").get(authController.protect, viewController.getUserProfilePage);
router.route("/new-blog-post").get(authController.protect, viewController.getNewBlogPostPage);
router.route("/my-blogs").get(authController.protect, viewController.getMyBlogsPage);
router.route("/my-blogs/:saveType/:viewType/:slug").get(authController.protect, viewController.getMySingleBlog);

module.exports = router;