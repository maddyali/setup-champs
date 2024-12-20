const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const postsController = require("../controllers/posts");
const ensureAuth = require("../middleware/auth");

router.get("/", homeController.getIndex);
router.get("/signup", authController.getSignup);
router.get("/login", authController.getLogin);
router.get("/logout", authController.logout);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);

// POST

router.post("/signup", authController.postSignup);
router.post("/login", authController.postLogin);

// Catchall route for 404
// router.all("*", (req, res) => {
//   res.status(404).send("404 - Page Not Found");
// });

module.exports = router;
