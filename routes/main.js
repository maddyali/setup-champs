const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");

router.get("/", homeController.getIndex);
router.get("/signup", authController.getSignup);
router.get("/login", authController.getLogin);

// POST

router.post("/signup", authController.postSignup);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

// Catchall route for 404
router.all("*", (req, res) => {
  res.status(404).send("404 - Page Not Found");
});

module.exports = router;
