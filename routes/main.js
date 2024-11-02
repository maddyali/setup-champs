const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");

router.get("/", homeController.getIndex);
router.get("/signup", authController.getSignup);
router.get("/login", authController.getLogin);

module.exports = router;
