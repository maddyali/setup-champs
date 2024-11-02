const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
});

// Pre-save middleware to hash the password

UserSchema.pre("save", function save(next) {
  const user = this;

  // Only hash the password if its been modified or is new

  if (!user.isModified("password")) {
    return next();
  }

  // Generate a salt and hash the password

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      console.log(`salthash pw: ${user.password}`);

      next();
    });
  });
});

// Compare entered password with stored hashed password

UserSchema.methods.comparePassword = function comparePassword(
  enteredPassword,
  cb
) {
  bcrypt.compare(enteredPassword, this.password, (err, isMatch) => {
    console.log(`enteredpw: ${enteredPassword}, hashpw: ${this.password}`);
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
