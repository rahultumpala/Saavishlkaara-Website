const express = require("express");
const viewController = require("../controllers/viewController")
const router = express.Router();

router.get("/", viewController.getHomepage)
router.route("/contact").get();


module.exports = router;