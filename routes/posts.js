const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const ensureAuth = require("../middleware/auth");
const postsController = require("../controllers/posts");

router.get("/bookmarked", ensureAuth, postsController.getBookmarkedPosts);
router.get("/:id", ensureAuth, postsController.getPost);
router.post("/createPost", upload.single("file"), postsController.createPost);
router.put("/bookmarkPost/:id", postsController.bookmarkPost);
router.put("/likePost/:id", postsController.likePost);
router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
