const { User } = require("../models/user"); // CommonJS
const ErrorHandler = require("../utils/utility-class"); // Use require instead of import

const TryCatch = require("../middlewares/error.js").TryCatch;
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailer.js").sendMail;
const randomstring = require("randomstring");
const Resetpassword = require("../models/passwordReset.js").Resetpassword;
const jwt = require("jsonwebtoken");

const newUser = TryCatch(async (req, res, next) => {
  const { firstName, lastName, email, gender, dob, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: `Email already exists`,
    });
  }

  if (!firstName || !lastName || !email || !gender || !dob || !password) {
    return next(new ErrorHandler("Please add all fields", 400));
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    photo: "",
    gender,
    dob: new Date(dob),
    password: hashPassword,
  });

  let msg = `<p>Congratulations! ${firstName} You have successfully registered at Macho Man Shop. Welcome to the Macho Man community!</p>`;
  // sendMail(email, "Registration Successful", msg);

  res.status(200).json({
    success: true,
    message: `Welcome ${firstName}`,
  });
});

const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    users,
  });
});

const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid Id", 400));
  return res.status(200).json({
    success: true,
    user,
  });
});

const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid Id", 400));
  await user.deleteOne();
  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

const forgetPassword = TryCatch(async (req, res, next) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: `Email doesn't exist`,
    });
  }
  const randomString = randomstring.generate();
  let msg = `<p>Hi ${user.firstName}, please click <a href="${process.env.BASE_URL}macho-man-shop/update-password/${randomString}">click here</a> to reset your password!</p>`;
  await Resetpassword.deleteMany({ user_id: user._id });
  let passwordReset = new Resetpassword({
    user_id: user._id,
    token: randomString,
  });
  await passwordReset.save();
  // sendMail(user.email, "Reset password", msg);
  return res.status(200).json({
    success: true,
    message: "Reset password sent successfully",
  });
});

const getResetPassword = TryCatch(async (req, res, next) => {
  const { token } = req.query;
  if (token === undefined) {
    return next(new ErrorHandler("Invalid token", 400));
  }
  let resetData = await Resetpassword.findOne({ token });
  if (!resetData) {
    return next(new ErrorHandler("Invalid token", 400));
  }
  return res.status(200).json({
    success: true,
    message: "User token checked successfully",
    user_id: resetData.user_id,
  });
});

const updatePassword = TryCatch(async (req, res, next) => {
  const { user_id, password, c_password } = req.body;
  const resetData = await Resetpassword.findOne({ user_id });
  if (!resetData) {
    return next(new ErrorHandler("Invalid Id", 400));
  }
  const hashPassword = await bcrypt.hash(c_password, 10);
  await User.findByIdAndUpdate(user_id, {
    $set: {
      password: hashPassword,
    },
  });
  await Resetpassword.deleteMany({ user_id });
  return res.status(200).json({
    success: true,
    message: "User password updated successfully",
  });
});

const generateAccessToken = (user) => {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(
    email,
    password,
    "========================================================="
  );
  const userData = await User.findOne({ email });
  if (!userData) return next(new ErrorHandler("Invalid email - password", 401));
  const passwordMatch = await bcrypt.compare(password, userData.password);
  if (!passwordMatch)
    return next(new ErrorHandler("Invalid email - password", 401));
  if (userData.is_Verified === 0)
    return next(new ErrorHandler("Please verify your account", 402));
  console.log(
    "=========================================================",
    userData
  );
  const accessToken = await generateAccessToken({ user: userData });
  return res.status(200).json({
    success: true,
    message: "User login successfully",
    accessToken,
    tokenType: "Bearer",
  });
});

const profile = TryCatch(async (req, res, next) => {
  const userProfile = req.user;
  return res.status(200).json({
    success: true,
    userProfile,
    message: "User profile",
  });
});

module.exports = {
  newUser,
  getAllUsers,
  getUser,
  deleteUser,
  forgetPassword,
  getResetPassword,
  updatePassword,
  login,
  profile,
};
