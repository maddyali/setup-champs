const Post = require("../models/Post");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getProfile: async (req, res) => {
    try {
      req.session.returnTo = req.originalUrl;

      const posts = await Post.find({ user: req.user.id });

      res.render("profile.ejs", { user: req.user, posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        user: req.user.id,
        userName: req.user.userName,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
      });

      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      req.session.returnTo = req.originalUrl;

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
  bookmarkPost: async (req, res) => {
    try {
      const post = await Post.findById({ _id: req.params.id });

      if (post.bookmarks.includes(req.user.id)) {
        await Post.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $pull: { bookmarks: req.user.id }, // remove user id
          }
        );
      } else {
        await Post.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $addToSet: { bookmarks: req.user.id }, // Prevent duplicate entries
          }
        );
      }

      res.redirect(req.session.returnTo || `/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  getBookmarkedPosts: async (req, res) => {
    try {
      req.session.returnTo = req.originalUrl;

      const bookmarkedPosts = await Post.find({
        bookmarks: req.user.id,
      }).lean();

      res.render("bookmarked.ejs", { user: req.user, posts: bookmarkedPosts });
    } catch (err) {
      console.log(err);
      res.redirect("/profile");
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likes: req.user.id },
        },
        { new: true }
      );

      res.redirect(req.session.returnTo || "/feed");
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Post.findById({ _id: req.params.id });

      await cloudinary.uploader.destroy(post.cloudinaryId);
      await Post.findOneAndDelete({ _id: post._id });

      res.redirect(req.session.returnTo || "/profile");
    } catch (err) {
      console.log(err);
    }
  },
};
