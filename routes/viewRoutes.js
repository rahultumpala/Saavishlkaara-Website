const express = require("express");
const viewController = require("../controllers/viewController")
const router = express.Router();

router.route("/contact").get();

router.route("/").get(viewController.getHomepage)

module.exports = router;