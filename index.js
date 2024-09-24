const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoute = require("./routes/user.js");

// dotenv config
dotenv.config();

// MongoDB connection
connectDB();

// Rest object
const app = express();
app.use(cors());

// Middlewares
app.use(express.json());
app.use(moragan("dev"));

app.get("/hello", (req, res) => {
  res.send("API Working with /api/v1");
});

// User routes
app.use("/api/v1/user", userRoute);
// app.use("/api/v1/admin", require("./routes/adminRoutes"));
// app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
// app.use("/api/v1/blog", require("./routes/blogRoutes"));

// Port
const port = process.env.PORT || 8080;

// Listen on port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
