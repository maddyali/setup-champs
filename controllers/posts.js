const Post = require("../models/Post");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });

      res.render("profile.ejs", { user: req.user, posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      console.log(req.file);
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        user: req.user.id,
        userName: req.user.userName,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
      });

      console.log("Post created!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();

      res.render("feed.ejs", { user: req.user, posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
};
