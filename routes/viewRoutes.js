const express = require("express");
const viewController = require("../controllers/viewController")
const router = express.Router();

router.get("/", viewController.getHomepage)
router.route("/contact").get(viewController.getContactPage);
router.route("/about").get(viewController.getAboutPage);
router.route("/blog").get(viewController.getBlogPage);
router.route("/our-team").get(viewController.getTeamPage);
router.route("/courses").get(viewController.getCoursesPage);


module.exports = router;