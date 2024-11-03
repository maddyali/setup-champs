const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
});

// Pre-save middleware to hash the password

UserSchema.pre("save", async function save(next) {
  const user = this;

  // Only hash the password if its been modified or is new

  if (!user.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    user.password = bcrypt.hash(user.password, salt);

    next();
  } catch (error) {
    return next(error);
  }
});

// Compare entered password with stored hashed password

UserSchema.methods.comparePassword = async function comparePassword(
  enteredPassword
) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log(`pw: ${enteredPassword}, hashpw: ${this.password}`);
    return isMatch; // Return the result
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("User", UserSchema);
