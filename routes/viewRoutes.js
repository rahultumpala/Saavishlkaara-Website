const express = require("express");
const viewController = require("../controllers/viewController")
const router = express.Router();

router.route("/our-team").get(viewController.getTeamPage);
router.get("/", viewController.getHomepage)
router.route("/contact").get(viewController.getContactPage);
router.route("/about").get(viewController.getAboutPage);
router.route("/blog").get(viewController.getBlogPage);
router.route("/courses").get(viewController.getCoursesPage);
router.route("/campus-ambassadors").get(viewController.getCampusAmbassadorsPage);


module.exports = router;