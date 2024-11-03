const User = require("../models/User");
const validator = require("validator");

exports.getSignup = (req, res) => {
  res.render("signup.ejs");
};
exports.getLogin = (req, res) => {
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

  if (validationErrors.length) {
    return res.status(422).json({
      errors: validationErrors,
    });
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
    console.log("User saved with hashed password:", user.password);

    res.status(200).json({
      msg: "signed up",
      user: user,
    });
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user in DB
    const user = await User.findOne({ email });

    // If user not found, respond with error
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    // Compare entered password with stored hashed password
    const isMatchCorrect = await user.comparePassword(password);

    // Send correct response
    if (isMatchCorrect) {
      console.log("Correct password match:", isMatchCorrect);
      return res.status(200).json({ msg: "login succesful" });
    } else {
      return res.status(401).json({ msg: "invalid password" });
    }
  } catch (error) {
    console.log("Error during login:", error);

    return res.status(500).json({ msg: "internal server error" });
  }
};

exports.postLogout = (req, res) => {
  res.json({
    timestamp: Date.now(),
    msg: "logout succesful",
    code: 200,
  });
};
