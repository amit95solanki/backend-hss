const express = require("express");
const {
  deleteUser,
  forgetPassword,
  getAllUsers,
  getResetPassword,
  getUser,
  login,
  newUser,
  profile,
  updatePassword,
} = require("../controllers/user.js");
const { adminOnly, verifyToken } = require("../middlewares/auth.js");

const app = express.Router();

// Route - /api/v1/user/new
app.post("/new", newUser);
app.post("/login", login);

// Route - /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);

// Route - /api/v1/user/forget-password
app.post("/forget-password", forgetPassword);

// Route - /api/v1/user/reset-password
app.get("/reset-password", getResetPassword);

// Route - /api/v1/user/update-password
app.post("/update-password", updatePassword);

// Route - /api/v1/user/profile
app.get("/user-profile", verifyToken, profile);

// Route - /api/v1/user/dynamicID
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);

module.exports = app;
