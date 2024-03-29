const express = require("express")
const authController = require("../controllers/authController")

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/verify").post(authController.verifyToken);
router.route("/logout").post(authController.logout);

module.exports = router;