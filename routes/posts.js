const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const ensureAuth = require("../middleware/auth");
const postsController = require("../controllers/posts");

// TODO Select posts
router.get("/bookmarked", ensureAuth, postsController.getBookmarkedPosts);
router.get("/:id", ensureAuth, postsController.getPost);
// TODO Add functionality to upload files
router.post("/createPost", upload.single("file"), postsController.createPost);
// TODO Bookmark posts
router.put("/bookmarkPost/:id", postsController.bookmarkPost);

// TODO Like posts

// TODO Delete posts

module.exports = router;
