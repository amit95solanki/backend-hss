const multer = require("multer");
const { v4: uuid } = require("uuid");

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Set the destination folder for file uploads
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    // Generate a unique filename using UUID and preserve the file extension
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    const filename = `${id}.${extName}`;
    // Log the generated filename for debugging purposes
    console.log("Generated filename:", filename);
    // Pass the generated filename to multer
    callback(null, filename);
  },
});

// Create a multer instance for handling single file uploads
const singleUpload = multer({ storage }).single("photo");

module.exports = {
  singleUpload,
};
