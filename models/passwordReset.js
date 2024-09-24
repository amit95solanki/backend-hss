const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
});

const Resetpassword = mongoose.model("PasswordReset", schema);

module.exports = { Resetpassword };
