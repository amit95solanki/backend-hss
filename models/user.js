const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  gender: String,
  dob: Date,
  password: String,
  // Add other fields as necessary
});

const User = mongoose.model("User", userSchema);

module.exports = { User }; // Ensure this is correctly exported
