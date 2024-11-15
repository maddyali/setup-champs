const Post = require("../models/Post");

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
      await Post.create({
        user: req.user.id,
        image: "",
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

      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
};
