const User = require("../models/User");
const validator = require("validator");
const passport = require("passport");

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup.ejs");
};

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login.ejs");
};

// POST

exports.postSignup = async (req, res) => {
  // Validate user input
  const validationErrors = [];

  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter valid email address." });

  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long.",
    });

  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/signup");
  }

  // Normalize user email
  req.body.email = validator.normalizeEmail(req.body.email);

  // Create new user
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    // Save new user
    await user.save();

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", { msg: "Welcome! You are now logged in." });
    });

    res.redirect("/profile");
  } catch (error) {
    console.log("Error saving user:", error);
    req.flash("errors", { msg: "There was an error creating your account." });
    res.redirect("/signup");
  }
};

exports.postLogin = async (req, res, next) => {
  // Validate user input
  const validationErrors = [];

  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter valid email address." });

  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }

  // Normalize user email
  req.body.email = validator.normalizeEmail(req.body.email);

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }

    // Attach authenticated user object to req.user property
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    // Destroy the session data
    req.session.destroy((err) => {
      if (err) {
        console.log("Error: failed to destroy session during logout.", err);
      }
      req.user = null;
      console.log("Goodbye! You are logged out.");

      res.redirect("/");
    });
  });
};
