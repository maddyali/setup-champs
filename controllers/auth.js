const User = require("../models/User");

exports.getSignup = (req, res) => {
  res.render("signup.ejs");
};
exports.getLogin = (req, res) => {
  res.render("login.ejs");
};

// POST

exports.postSignup = async (req, res) => {
  // Create new user
  const user = new User({
    userName: req.query.userName,
    email: req.query.email,
    password: req.query.password,
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
  const { email, password } = req.query;
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
