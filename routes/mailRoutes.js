const express = require("express");
const mailController = require("../controller/mailController")
const router = express.Router();

router.route("/contact-form-mail").post(mailController.sendContactMail)

module.exports = router;