const express = require("express");
const router = express.Router();
const ensureAuth = require("../middleware/auth");
const postsController = require("../controllers/posts");

// TODO Select posts

// TODO Add functionality to upload files
router.post("/createPost", postsController.createPost);

// TODO Like posts

// TODO Delete posts

module.exports = router;
