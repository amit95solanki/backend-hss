const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

//dotenv conig
dotenv.config();

//mongodb connection
connectDB();

//rest obejct
const app = express();
app.use(cors());
//middlewares
app.use(express.json());
app.use(moragan("dev"));

app.get("/hello", (req, res) => {
  res.send("API Working with /api/v1");
});

//routes
// app.use("/api/v1/user", require("./routes/userRoutes"));
// app.use("/api/v1/admin", require("./routes/adminRoutes"));
// app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
// app.use("/api/v1/blog", require("./routes/blogRoutes"));
//port
const port = process.env.PORT || 8080;
//listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
