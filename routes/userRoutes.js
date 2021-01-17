const express = require("express")
const userController = require("../controllers/authController")

const router = express.Router();

router.route("signup").post();

module.exports = router;