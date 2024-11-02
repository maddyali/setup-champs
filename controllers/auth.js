exports.getSignup = (req, res) => {
  res.render("signup.ejs");
};
exports.getLogin = (req, res) => {
  res.render("login.ejs");
};
exports.postSignup = (req, res) => {
  res.json({
    timestamp: Date.now(),
    msg: "signed up",
    code: 200,
  });
};

exports.postLogin = (req, res) => {
  res.json({
    timestamp: Date.now(),
    msg: "login succesful",
    code: 200,
  });
};

exports.postLogout = (req, res) => {
  res.json({
    timestamp: Date.now(),
    msg: "logout succesful",
    code: 200,
  });
};
