const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await User.findOne({ email: email.toLowerCase() });

          if (!user) {
            return done(null, false, { message: `Email ${email} not found.` });
          }

          // Check entered password with stored hashed password
          const isMatch = await user.comparePassword(password);

          if (!isMatch) {
            return done(null, false, { message: "Invalid password." });
          }

          // Password matches, return authenticated user
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  // Serialize user into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
